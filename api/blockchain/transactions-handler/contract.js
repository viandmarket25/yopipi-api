const Web3 = require('web3')
const fs = require('fs')
const web3 = new Web3('http://127.0.0.1:7545')
let contractAddress = '0x257F7F0E81e7f3fFEC841a15994A3eB8e9987Ce6';
let ownerAddress = '0xA1A196E2d3759382e0DC10cA275e4Ce2a88Ca21e';
let fileData
let abi = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "_itemsAvailable",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "_itemsAvailablePerSecond",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "_itemsSold",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "_itemsSoldPerSecond",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "_itemsTotal",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "_tokenIds",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }],
        "name": "getApproved",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "hh",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "listingDuration",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "listingEnd",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "listingPrice",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "listingStart",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }],
        "name": "ownerOf",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
        }],
        "name": "supportsInterface",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }],
        "name": "tokenURI",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getListingPrice",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getHi",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "_listingPrice",
            "type": "uint256"
        }],
        "name": "setListingPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "name": "createNFT",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
let abiUrl = '';
//abi = fileData.abi;
const Web3EthContract = require('web3-eth-contract');
// Set provider for all later instances to use
Web3EthContract.setProvider('ws://localhost:7545');
const contract_ = new Web3EthContract(abi, contractAddress);
let contractManager = {
    tokenURI: "https://gateway.pinata.cloud/ipfs/QmRYUG9TVorw463mUD733E6UKoubi3G5E27c6E9GcyJrxV",
    contractAddress: "",
    ownerAddress: "",
    gasPrice: 2000000,
    gasLimit: 30000000,
    fileData: '',
    init: async(ownerAddress, contractAddress) => {
        this.contractAddress = contractAddress;
        this.ownerAddress = ownerAddress;
        console.log(this.contractAddress, this.ownerAddress);
        let tokenURI = this.tokenURI;
        lp = await contractManager.getListingPrice();
        console.log(lp);
        let createNFT = await contractManager.createNFT(ownerAddress, tokenURI);
        console.debug("createNFT::: ", createNFT);
        return createNFT;
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
            /*
            return new Promise((resolve) => {
                contract_.methods.getListingPrice().send({ from: ownerAddress, gasPrice: 2000000 })
                    .on('receipt', function() {
                        console.log('receipt', receipt);
                    })
                    .then((result) => {
                        resolve(result)
                    }).catch((error) => {
                        console.log(error)
                    });
            })
            */

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
    getContractAddress: () => {

    },
    getContractOwner: () => {

    },
    createNFT: async(receiver, tokenURI) => {
        let gasPrice = this.gasPrice;
        let gasLimit = this.gasLimit;
        let ownerAddress = this.ownerAddress;
        let contractAddress = this.contractAddress;
        /****
         *  Pass the receiver and the token uri arguments for minting
         * 
         * ***/
        return new Promise((resolve) => {
            contract_.methods.createNFT(receiver, tokenURI).send({ from: ownerAddress, gasPrice: gasPrice })
                .on('receipt', function() {
                    console.log('NFT Created Successfully');
                })
                .then((result) => {
                    resolve(result)
                }).catch((error) => {
                    console.log(error)
                });
        })
    },
    mintNFT: async() => {


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
contractManager.init(ownerAddress, contractAddress);
//contract.defaultBlock;
//contract.defaultHardfork;
//contract.defaultChain;
//contract.defaultCommon;
//myContract.options;
//myContract.options;