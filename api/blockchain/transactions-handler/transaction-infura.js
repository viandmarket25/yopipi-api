const Web3 = require("web3")
const Tx = require('ethereumjs-tx').Transaction
const ethNetwork = 'https://ropsten.infura.io/v3/b9648bb4509348f5a0feab935cbc11f8'
const Accounts = require('web3-eth-accounts');
const Personal = require('web3-eth-personal');


let web3
try {
    web3 = new Web3(ethNetwork);
    //web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));


    console.log("Connection Successfull!");
    console.log("Latest Block Number: ");
    web3.eth.getBlockNumber().then(console.log);
} catch (e) {
    console.log("Connection Error!", e);
}



class EtheriumTranscation {
    gasPrice = 20000000;
    gasLimit = 30000;
    ether = 2;
    sendingAddress = "";
    receivingAddress = "";
    privateKey = "";
    totalAccounts = 0;
    // Passing in the eth or web3 package is necessary to allow retrieving chainId, gasPrice and nonce automatically
    // for accounts.signTransaction().
    accounts = new Accounts('wss://ropsten.infura.io/ws/v3/b9648bb4509348f5a0feab935cbc11f8');
    personal = new Personal(Personal.givenProvider || 'wss://ropsten.infura.io/ws/v3/b9648bb4509348f5a0feab935cbc11f8');

    constructor() {}
    async init() {
        this.getAccountsList()
        if (this.totalAccounts > 0) {
            this.sendingAddress = await this.getAccountAddress(0)
            this.receivingAddress = await this.getAccountAddress(1)

        }

        this.privatekey = "f0ddb0132b00d2cd9e04e241955ca80615a8f690a2194b0168cc57a390cc6a33"
        console.log("sending addr: ", this.sendingAddress, "receiving addr: ", this.receivingAddress, "private key:   ", this.privatekey)
            /*
            this.makeTranscation(this.privatekey, this.gasPrice, this.gasLimit, this.ether.toString()).then(res => {
                this.getBalance(this.sendingAddress)
                this.getBalance(this.receivingAddress)
            }).catch((err) => {
                console.log(err)
            })
            */
        this.createAccount()

    }
    async makeTranscation(privateKey, gasPrice, gasLimit, ether) {
            privateKey = this.privatekey
            gasPrice = this.gasPrice
            gasLimit = this.gasLimit
            ether = this.ether
            console.log(this.privatekey, gasPrice, gasLimit, ether)
            let receivingAddress = this.receivingAddress;
            const NOUNCE = await this.nounce();
            return new Promise((resolve) => {
                var rawTranscation = {
                    nonce: NOUNCE,
                    to: receivingAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(gasLimit),
                    value: web3.utils.toHex(web3.utils.toWei(ether, 'ether')).toString()
                }
                var privateKeySender = privateKey;
                var privateKeySenderHex = Buffer.from(privateKeySender, 'hex')
                var transaction = new Tx(rawTranscation)
                transaction.sign(privateKeySenderHex)
                var serializedTransaction = transaction.serialize();
                resolve(web3.eth.sendSignedTransaction(serializedTransaction));
            });
        }
        // -- Get Balance of the specified address.
    async getBalance(address) {
        const msg = await this.getBalanceFromAddress(address);
        console.debug(msg)
    }
    getAccountsList() {
        let accounts = this.accounts;
        let personal = this.personal;
        let accounts_
        let first
        let totalAccounts
        web3.eth.getAccounts().then(accountL => {
            console.debug(accountL)
            totalAccounts = accountL.length

            //console.debug(accountL, first)
        });
        this.totalAccounts = totalAccounts
        return accounts_
    }
    async getAccountAddress(index) {
        return new Promise(resolve => {
            web3.eth.getAccounts(
                function(err, result) {
                    if (err) {
                        console.debug(err)
                    } else {
                        resolve(result[index])
                    }
                }
            )
        })
    }
    getBalanceFromAddress(address) {
            return new Promise(resolve => {
                web3.eth.getBalance(address, function(err, result) {
                    if (err) {
                        console.debug(err)
                    } else {
                        resolve(web3.utils.fromWei(result, "ether") + " ETH")
                    }
                })
            })
        }
        //--  Get Latest Nounce dynamically.
    dynamicNounce(sendingAddress) {
        return new Promise((resolve) => {
            web3.eth.getTransactionCount(sendingAddress)
                .then((val) => {
                    resolve(val)
                }).catch((err) => {
                    console.log(err)
                });
        })
    }
    async nounce() {
        return await this.dynamicNounce(this.sendingAddress)

    }
    async createAccount() {
        let accounts = this.accounts;
        let personal = this.personal;


        //web3.eth.personal.newAccount('!@superpassword').then(console.log);
        web3.eth.accounts.create().then(console.log);
    }
    recoverTransaction(txHash) {
            return new Promise((resolve) => {
                web3.eth.accounts.recoverTransaction(txHash, function(err, result) {
                    if (err) {
                        console.debug(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        }
        /***
         * takes in account private key and password
         * returns encryption object
         * ***/
    encryptKey(privateKey, password) {
            return new Promise((resolve) => {
                web3.eth.accounts.encrypt(privateKey, password)
                    .then((val) => {
                        resolve(val)
                    }).catch((err) => {
                        console.log(err)
                    });
            })
        }
        /***
         * takes in account encrypted key and password
         * returns encryption object
         * ***/
    decryptKey(privateKey, password) {
            return new Promise((resolve) => {
                web3.eth.accounts.decrypt(privateKey, password)
                    .then((val) => {
                        resolve(val)
                    }).catch((err) => {
                        console.log(err)
                    });
            })
        }
        /***
         * wallets allows to create multiple accounts
         * 
         * 
         * ***/
    createWallet() {
        return new Promise((resolve) => {
            web3.eth.accounts.wallet.create(2, "")
                .then((accounts) => {
                    resolve(accounts)
                        //get first account properties
                    account_1 = accounts[0];
                    //get second account properties
                    account_2 = accounts[1];
                    // get first account private key
                    privateKey_1 = account_1.privateKey;
                    //get second account address
                    address_2 = account_2.address;
                }).catch((err) => {
                    console.log(err)
                });
        })
    }




}
//console.debug(accounts)
let txn = new EtheriumTranscation();
txn.init()