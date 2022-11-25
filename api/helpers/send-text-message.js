const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "3c177a6b",
  apiSecret: "74cJyDahjfzeDyH3"
})

const from = "Vonage APIs"
const to = "8615669860302"
const text = 'A text message sent using the Vonage SMS API'

vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})
