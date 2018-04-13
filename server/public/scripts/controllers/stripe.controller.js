myApp.controller('StripeController', ['UserService', '$location', '$window', '$http', function(UserService, $location, $window, $http){
    const self = this;


    self.user = UserService.user;
    self.UserService = UserService;
    // This is called with the results from from FB.getLoginStatus().
    statusChangeCallback = function(response) {
      console.log(response, 'in statusChangeCallback');
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
      UserService.testAPI(self.user)
      } else {
        $location.url("/error");
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
      }
    }


    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
     checkLoginState= UserService.checkLoginState;

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $window.fbAsyncInit = function() {
      FB.init({
        appId      : '1959229107724531',
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        status     : true,  //Determines whether the current login status of the user
                            //is freshly retrieved on every page load. If this is disabled,
                            //that status will have to be manually retrieved using .getLoginStatus()
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use graph api version 2.8
      });

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.

      FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
      });
    };

    self.fbLogout = UserService.fbLogout;

  self.stripeCustomerInfo = UserService.stripeCustomerInfo;
  self.getStripeCustomerInfo = UserService.getStripeCustomerInfo;

  self.fbLogout = UserService.fbLogout;

  // let stripeAuthResponse = function(){ 
  // }

  // if(stripeAuthResponse() == null){
  //   console.log('user must login to view this data');
  //   $location.path("/login");
  //   $window.location.reload();
  // }

  var stripe = Stripe('pk_test_am5RbEIakojCTGAR6pNGMvfO');
    let elements = stripe.elements({
        fonts: [
            {
                cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
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
                iconColor: '#c4f0ff',
                color: '#fff',
                fontWeight: 500,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
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

    console.log('user id', UserService.user.id);
    

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
            userId: UserService.user.id,
        };
        $http.post('/stripe/register', newCustomerData)
        .then(response => {
            console.log(response);
            self.UserService.checkForRegistration(self.UserService.user);
            self.getStripeCustomerInfo();
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
