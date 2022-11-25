let envProcess = require('dotenv').config({ path: '../api/credentials.env' })
const ropstenPath = envProcess.parsed.INFURA_ROPSTEN_WSS +
    envProcess.parsed.INFURA_PROJECT_ID
const rinkebyPath = envProcess.parsed.INFURA_RINKEBY_WSS +
    envProcess.parsed.INFURA_PROJECT_ID
const metamaskPrivateKey = envProcess.parsed.METAMASK_PRIVATE_KEY
const metamaskMnemonics = envProcess.parsed.METAMASK_MNEMONICS
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Tx = require('ethereumjs-tx').Transaction;
const fs = require('fs')
const provider = new HDWalletProvider({
    mnemonic: metamaskMnemonics,
    providerOrUrl: rinkebyPath,
});
//Web3.providers.HttpProvider(rinkebyPath);
const web3 = new Web3(provider)
let contractAddress = envProcess.parsed.ROPSTEN_CONTRACT_ADDRESS;
let ownerAddress = envProcess.parsed.CONTRACT_OWNER_ADDRESS;
let fileData
let abi = fs.readFileSync('../abis/rinkeby.json')
abi = JSON.parse(abi);
//console.log(ropstenPath, rinkebyPath, abi);

let abiUrl = '';
//abi = fileData.abi;
const Web3EthContract = require('web3-eth-contract');
// Set provider for all later instances to use
Web3EthContract.setProvider(rinkebyPath);
const contract_ = new Web3EthContract(abi, contractAddress);

//console.log(contract_)
let contractManager = {
    tokenURI: "https://gateway.pinata.cloud/ipfs/QmRYUG9TVorw463mUD733E6UKoubi3G5E27c6E9GcyJrxV",
    contractAddress: "",
    ownerAddress: "",
    gasPrice: 2000000,
    gasLimit: 30000000,
    fileData: '',
    privateKey: '',
    data: '',
    init: async(ownerAddress, contractAddress, privateKey, data) => {
        contractManager.contractAddress = contractAddress;
        contractManager.ownerAddress = ownerAddress;
        contractManager.privateKey = privateKey;
        contractManager.data = data;
        console.log("Contract ADDR:: ", contractManager.contractAddress, "Owner ADDR:: ", contractManager.ownerAddress);
        //lp = await contractManager.getListingPrice();


        // ::::::::::::: Mint NFT
        if (contractManager.data.type == 'mintNft') {
            for (let i = 0; i < contractManager.data.urlList.length; i++) {
                console.debug("METADATA::: ", contractManager.data.urlList[0]);
                let createNFT = await contractManager.createNFT(ownerAddress, contractManager.data.urlList[i]);
                console.log('NFT CREATED:: ', createNFT)
            }
            console.log('Minting Complete !')
        }
        if (contractManager.data.type == 'transferNft') {


        }

    },
    readFile: () => {
        fs.readFile(abiUrl, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            //console.log(data)
            this.fileData = JSON.parse(data)
                //console.log(fileData.abi)
        })
    },
    getListingPrice: async() => {
        return new Promise((resolve) => {
            contract_.methods.getListingPrice().call()
                .then((result) => {
                    resolve(result)
                }).catch((error) => {
                    console.log(error)
                });
        })
    },
    getNonce: async() => {
        return new Promise((resolve) => {
            web3.eth.getTransactionCount(ownerAddress)
                .then((result) => {
                    resolve(result)
                }).catch((error) => {
                    console.log(error)
                });
        })
    },
    setListingPrice: async(newValue) => {
        /****
         * modify contract value
         * returns receipt
         * ***/
        let gasPrice = this.gasPrice;
        return new Promise((resolve) => {
            contract_.methods.setListingPrice(newValue).send({ from: ownerAddress, gasPrice: gasPrice })
                .on('receipt', function() {
                    console.log('Contract Transaction Success');
                })
                .then((result) => {
                    resolve(result)
                }).catch((error) => {
                    console.log(error)
                });
        })
    },
    createNFT: async(receiver, tokenURI) => {
        console.log("LETS CREATE NFT::")
        let ownerAddress = contractManager.ownerAddress;
        //console.log(receiver, tokenURI, ownerAddress, gasPrice)
        let nonce = await contractManager.getNonce()
        const targetContract = contract_.methods.createNFT(ownerAddress, tokenURI)
        return new Promise((resolve) => {
            let contractTransaction = {
                to: contractAddress,
                data: targetContract.encodeABI(),
                gasPrice: 200000000000,
                gasLimit: 2000000,
                nonce: nonce,
                chainId: 4
            }
            let transaction = new Tx(contractTransaction, { 'chain': 'rinkeby' })
            transaction.sign(privateKey1)
            let serializedTransaction = transaction.serialize();
            resolve(web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
                .on('receipt', function() {
                    console.log('Contract Transaction Success');
                })
            );
        })

    },
    addTokenToMarket: async() => {

    },
    sellToken: () => {

    },
    transferNFTOwnership: async() => {

    },
    getContractDefaultBlock: () => {

    },
    getContractHardFork: () => {

    },
    getContractDefaultChain: () => {

    },
    getContractDefaultCommon: () => {

    },
    getContractOptions: () => {

    }
}
const privateKey1 = new Buffer.from(metamaskPrivateKey, 'hex')
let options = {
        type: 'mintNft',
        urlList: [
            "https://gateway.pinata.cloud/ipfs/QmNiQAaMpkjk9VnpRPUxmtF2m3jtVrUrDjKgk3mziqzSQZ",
            "https://gateway.pinata.cloud/ipfs/QmNiQAaMpkjk9VnpRPUxmtF2m3jtVrUrDjKgk3mziqzSQZ",
            "https://gateway.pinata.cloud/ipfs/QmbBt1FXiTihMFSfsnRLHkLNGbxZ8uAvKM3mhk8vM9Umfo",
            "https://gateway.pinata.cloud/ipfs/QmbBt1FXiTihMFSfsnRLHkLNGbxZ8uAvKM3mhk8vM9Umfo",
            "https://gateway.pinata.cloud/ipfs/QmbBt1FXiTihMFSfsnRLHkLNGbxZ8uAvKM3mhk8vM9Umfo",
            "https://gateway.pinata.cloud/ipfs/QmbBt1FXiTihMFSfsnRLHkLNGbxZ8uAvKM3mhk8vM9Umfo",
            "https://gateway.pinata.cloud/ipfs/QmNiQAaMpkjk9VnpRPUxmtF2m3jtVrUrDjKgk3mziqzSQZ",
        ],
    }
    // ::::::::::: INITIALIZE CONTRACT MANAGER WITH DATA
contractManager.init(ownerAddress, contractAddress, privateKey1, options);




//contract.defaultBlock;
//contract.defaultHardfork;
//contract.defaultChain;
//contract.defaultCommon;
//myContract.options;
//myContract.options;