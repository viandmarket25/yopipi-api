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
let paymentByBankModel={
  account_bank: "044",
  account_number: "0690000037",
  amount: 7500,
  currency: 'NGN',
  email: 'twista@rove.press',
  tx_ref: flw.generateTransactionReference(),
  redirect_url:"https://your-awesome.app/payment-redirect",

  initiatePayment:()=>{
    account_bank: payload["account_bank"],
    account_number: payload["account_number"],
    amount: payload["amount"],
    currency: payload["currency"],
    email: payload["email"],
    tx_ref: flw.generateTransactionReference(),
    redirect_url:payload["redirect_url"],

    // :::::::: payload parameters
    const payload = {
        account_bank: "044",
        account_number: "0690000037",
        amount: 7500,
        currency: 'NGN',
        email: 'twista@rove.press',
        tx_ref: flw.generateTransactionReference(),
    }
    await flw.Charge.ng(payload);
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
  verifyPayment:()=>{
    // If we came from a redirect (Step 4), we'll need to
    // fetch the transactionID we stored earlier, using the tx_ref
    const txRef = paymentByBankModel.tx_ref
    const transactionId = await redis.getAsync(`txref-${txRef}`);
    // Otherwise, if we came from a validate process (Step 5),
    // we can just get the transaction ID from the response
    const transactionId = response.data.id;
    flw.Transaction.verify({ id: transactionId });


  },

}
