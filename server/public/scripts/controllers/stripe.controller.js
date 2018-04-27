myApp.controller('StripeController', ['UserService', '$location', '$window', '$http', '$mdDialog', function(UserService, $location, $window, $http, $mdDialog){
    
    const self = this;

    self.userObject = UserService.userObject;
    self.UserService = UserService;
    self.getAdmin = UserService.getAdmin;
    self.getUser = UserService.getUser;

    self.stripeCustomerInfo = UserService.stripeCustomerInfo;
    self.getStripeCustomerInfo = UserService.getStripeCustomerInfo;

    self.fbLogout = UserService.fbLogout;

    self.plan;

    var stripe = Stripe('pk_test_am5RbEIakojCTGAR6pNGMvfO');
        let elements = stripe.elements({
            fonts: [
                {
                    cssSrc: 'https://fonts.googleapis.com/css?family=Nunito',
                },
            ],
            locale: 'auto'
        });

    let style = {
        base: {
            fontSize: '16px',
            color: '#32325d',
        }
    };

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

    card.mount('#stripe-card');

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

    self.charities = {list: []};

    self.getNonprofits = function () {
        $http.get('/database/nonprofits')
            .then(response => {
                self.charities.list = response.data;
                console.log(self.charities.list);
            }).catch(err => {
                console.log(err);
            });
    }
    
}]);
