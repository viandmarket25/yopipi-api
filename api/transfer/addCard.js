let baseUrl='/Users/mac/Documents/yopipi-api/api/'
const Flutterwave = require('flutterwave-node-v3');
let envProcess = require('dotenv').config({path: baseUrl+'custom-libs/credentials.env' })
const flw = new Flutterwave(envProcess.parsed.FLUTTERWAVE_API_TEST_PUBLIC, envProcess.parsed.FLUTTERWAVE_API_TEST_SECRET);

// ::::::::::::::::::::::::::::: instantiate flutterwave api 
//console.log(Object.keys(flw) );

// :::::::::::::: Get Card Information, add to the database
// :::::::::::::::: Payment Initialization



let addCard = {
    card_number: '4556052704172643',
    cvv: '899',
    expiry_month: '01',
    expiry_year: '23',
    currency: 'NGN',
    amount: '100',
    email: 'developers@flutterwavego.com',
    fullname: 'Flutterwave Developers',
    tx_ref: 'MC-3243e',
    redirect_url: 'https://your-awesome.app/payment-redirect',
    enckey: envProcess.parsed.FLUTTERWAVE_API_TEST_ENCRYPT_KEY,
    result: {},
    authorizationModes: ['pin', 'avs_noauth', 'redirect', 'none'],
    cardPin:'',
    
    init: () => {
        addCard.card_number = '4105400025724376';
        addCard.cvv='899';
        addCard.expiry_month= '02';
        addCard.expiry_year= '25';
        // ::::::::::
        addCard.amount= '100';
        addCard.email= 'developers@flutterwavego.com';
        addCard.fullname= 'Flutterwave Developers';
        addCard.tx_ref= 'MC-3243e';
        addCard.redirect_url= 'https://your-awesome.app/payment-redirect';
            
        
    },
    dsAuthorization: () => { 

    },
    avsAuthorization: () => { 

    },
    pinAuthorization: () => {

    },
    chargeCard: async () => { 
        const payload = {
            card_number: addCard.card_number,
            cvv: addCard.cvv,
            expiry_month: addCard.expiry_month,
            expiry_year: addCard.expiry_year,
            currency: addCard.currency,
            amount: addCard.amount,
            email: addCard.email,
            fullname: addCard.fullname,
            tx_ref: addCard.tx_ref,
            redirect_url: addCard.redirect_url,
            enckey: addCard.enckey,
        }
        addCard.init();
        console.log(payload);
        await flw.Charge.card(payload).then(

            response => {

                addCard.result = response;
                
                console.log(addCard.result);
        });

     }

}


addCard.chargeCard();


/****
 * 
 * {
  "status": "success",
  "message": "Charge authorization data required",
  "meta": {
    "authorization": {
      "mode": "avs_noauth",
      "fields": [
        "city",
        "address",
        "state",
        "country",
        "zipcode"
      ]
    }
  }
}
 * 
 * 
 * 
 * 
 * 
 * 
 * ***/