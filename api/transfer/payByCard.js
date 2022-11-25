const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
// :::::::::::: type of charge [ bank, card ]
// ::::::::::: Steps
/*
  1. Initiate Payment
  2. Authorize Payment
  3. Validate Payment
  4. Verify Payment
*/
let paymentByCardModel={
  card_number: "4556052704172643",
  cvv: "899",
  expiry_month: "01",
  expiry_year: "23",
  currency: "NGN",
  amount: "7500",
  email: "developers@flutterwavego.com",
  fullname: "Flutterwave Developers",
  tx_ref: "MC-3243e",
  redirect_url:"https://your-awesome.app/payment-redirect",
  init:()=>{

  },
  initiatePayment:()=>{
    const payload = {
        card_number: '4556052704172643',
        cvv: '899',
        expiry_month: '01',
        expiry_year: '23',
        currency: 'NGN',
        amount: '7500',
        email: 'developers@flutterwavego.com',
        fullname: 'Flutterwave Developers',
        tx_ref: 'MC-3243e',
        redirect_url: 'https://your-awesome.app/payment-redirect',
        enckey: process.env.FLW_ENCRYPTION_KEY
    }
    flw.Charge.card(payload)
        .then(response => console.log(response));
  },
  authorizePayment:()=>{

    const transactionId = response.data.id;
    const flwRef = response.data.flw_ref;
    // Store the transaction ID
    // so we can look it up later with the tx_ref
    await redis.setAsync(`txref-${txRef}`, transactionId);
    const authUrl = response.meta.authorization.redirect;
    res.redirect(authUrl);
  },
  validatePayment:()=>{
    const response = await flw.Charge.validate({
        otp: req.body.otp,
        flw_ref: req.session.flw_ref
    });

  },
  verifyPayment:()=>{
    // If we came from a redirect (Step 4), we'll need to
    // fetch the transactionID we stored earlier, using the tx_ref
    const txRef = req.query.tx_ref
    const transactionId = await redis.getAsync(`txref-${txRef}`);
    // Otherwise, if we came from a validate process (Step 5),
    // we can just get the transaction ID from the response
    const transactionId = response.data.id;
    flw.Transaction.verify({ id: transactionId });


  },

}
