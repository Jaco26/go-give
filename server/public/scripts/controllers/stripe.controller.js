myApp.controller('StripeController', ['UserService', '$location', '$window', '$http', '$mdDialog', function(UserService, $location, $window, $http, $mdDialog){
    const self = this;


  self.userObject = UserService.userObject;
  self.UserService = UserService;
  self.getAdmin = UserService.getAdmin;
  self.getUser = UserService.getUser;

  self.stripeCustomerInfo = UserService.stripeCustomerInfo;
  self.getStripeCustomerInfo = UserService.getStripeCustomerInfo;

  self.fbLogout = UserService.fbLogout;

  var stripe = Stripe('pk_test_am5RbEIakojCTGAR6pNGMvfO');
    let elements = stripe.elements({
        fonts: [
            {
                cssSrc: 'https://fonts.googleapis.com/css?family=Nunito',
            },
        ],
        // Stripe's examples are localized to specific languages, but if
        // you wish to have Elements automatically detect your user's locale,
        // use `locale: 'auto'` instead.
        locale: 'auto'
    });

    // STEP 2: continued from payment form creation on HTML
    // custom styling can be passed to to options when creating an Element
    let style = {
        base: {
            // Add your base input styles here
            fontSize: '16px',
            color: '#32325d',
        }
    };

    // create an instance of the card Element
    let card = elements.create('card', {
        iconStyle: 'solid',
        style: {
            base: {
                iconColor: '#d8f1fe',
                color: '#fff',
                fontWeight: 500,
                fontFamily: 'Nunito, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',

                ':-webkit-autofill': {
                    color: '#fce883',
                },
                '::placeholder': {
                    color: '#87BBFD',
                },
            },
            invalid: {
                iconColor: '#FFC7EE',
                color: '#FFC7EE',
            },
        },
    });

    card.mount('#example1-card');

    self.editingEmail = false;
    self.editingCard = false;

    let form = document.getElementById('register-form');

    form.addEventListener('submit', function (event) {
        let nameInput = document.getElementById('name')
        let emailInput = document.getElementById('email')
        nameInput.setAttribute('name', 'name');
        nameInput.setAttribute('value', nameInput.value);
        emailInput.setAttribute('name', 'email');
        emailInput.setAttribute('value', emailInput.value);
        form.appendChild(nameInput);
        form.appendChild(emailInput);
        event.preventDefault();
        stripe.createSource(card).then(function (result) {
            if (result.error) {
                // Inform the user if there was an error
                let errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the source to your server
                card.clear()
                stripeSourceHandler(result.source);
            }
        });
    });

    function stripeSourceHandler(source) {
        // Insert the source ID into the form so it gets submitted to the server
        let form = document.getElementById('register-form');
        let hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeSource');
        hiddenInput.setAttribute('value', source.id);
        form.appendChild(hiddenInput);
        let newCustomerData = {
            name: form.elements[5].defaultValue,
            email: form.elements[6].defaultValue,
            stripeSource: form.elements[7].defaultValue,
            userId: UserService.userObject.fromOurDB.id,
        };
        console.log(newCustomerData, 'newCustomerData in stripe cont');
        $http.post('/stripe/register', newCustomerData)
        .then(response => {
            console.log(response);
            if (self.userObject.fromOurDB.role === 1){
              self.getAdmin();
            } else {
              self.getUser();
            }
            // self.getStripeCustomerInfo();
            $location.path('/payment');
        }).catch(err => {
            console.log(err);
        });
    }

    self.updateCard = function(customer_id){
        let customer = { id: customer_id }
        stripe.createSource(card).then(function (result) {
            if (result.error) {
                console.log('error creating source', result.error);
            } else {
                customer.source = result.source.id;
                $http({
                    method: 'POST',
                    url: '/stripe/updateCard',
                    data: customer
                }).then(response => {
                    console.log(response);
                    self.getStripeCustomerInfo();
                    self.editingCard = false;
                    card.clear();
                }).catch(err => {
                    console.log(err);
                })
            }
        });
    }

    self.updatedEmail;
    self.updateEmail = function(customer_id){
        let customer = { id: customer_id, email: self.updatedEmail }
        $http({
            method: 'POST',
            url: '/stripe/updateEmail',
            data: customer
        }).then(response => {
            console.log(response);
            self.getStripeCustomerInfo();
            self.editingEmail = false;
        }).catch(err => {
            console.log(err);
        })
    }

    self.confirmUnsubscribe = function(id, ev) {
        let confirm = $mdDialog.confirm()
            .title('Are you sure you want to unsubscribe?')
            .targetEvent(ev)
            .ok('UNSUBSCRIBE')
            .cancel('CANCEL');
        $mdDialog.show(confirm).then(function() {
            self.unsubscribe(id);
        }, function() {
            console.log('cancel unsubscribe');
        });
    };

    self.unsubscribe = function(id){
        $http({
            method: 'POST',
            url: '/stripe/unsubscribe',
            data: {id: id}
        }).then(response => {
            console.log(response);
            self.getStripeCustomerInfo();
        }).catch(err => {
            console.log(err);
        })
    }

    self.charities = {list: []};

    // Hard coded for stripe spike. dynamically filled with info from DB
    // upon successful login with facebook


    // Get a a list of 'products' (charities).
    // Each product should have a list of 'plans'
    self.getNonprofits = function () {
        $http.get('/database/nonprofits')
            .then(response => {
                self.charities.list = response.data;
                console.log(self.charities.list);
            }).catch(err => {
                console.log(err);
            });
    }

    self.plan;



}]);
