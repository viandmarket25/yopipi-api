let baseUrl='/Users/mac/Documents/yopipi-api/api/'
const Flutterwave = require('flutterwave-node-v3');
let envProcess = require('dotenv').config({path: baseUrl+'custom-libs/credentials.env' })
const flw = new Flutterwave(envProcess.parsed.FLUTTERWAVE_API_TEST_PUBLIC, envProcess.parsed.FLUTTERWAVE_API_TEST_SECRET);




// ::::::::::::::::::::::::::::: instantiate flutterwave api 
console.log(flw);