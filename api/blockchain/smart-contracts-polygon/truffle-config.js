const HDWalletProvider = require('@truffle/hdwallet-provider');
let envProcess = require('dotenv').config({ path: '/Users/mac/Documents/yopipi-web/backend/api/custom-libs/credentials.env' })
console.log("Contracts are connecting to network:")
const ropstenPath = envProcess.parsed.INFURA_ROPSTEN_WSS +
    envProcess.parsed.INFURA_PROJECT_ID
const rinkebyPath = envProcess.parsed.INFURA_RINKEBY_WSS +
    envProcess.parsed.INFURA_PROJECT_ID
const polygonMumbaiPath = envProcess.parsed.INFURA_POLYGON_MUMBAI_HTTPS +
    envProcess.parsed.INFURA_PROJECT_ID
const polygonMainNetPath = envProcess.parsed.INFURA_POLYGON_MAINNET_HTTPS +
    envProcess.parsed.INFURA_PROJECT_ID




console.log(polygonMumbaiPath)
module.exports = {
    networks: {
        development: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 7545, // Standard Ethereum port (default: none)
            network_id: "*", // Any network (default: none)
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(
                    envProcess.parsed.METAMASK_MNEMONICS,
                    rinkebyPath
                )
            },
            network_id: 4,
            gas: 3000000,
            gasPrice: 10000000000
        },
        ropsten: {
            network_id: 3,
            gas: 3022471,
            gasPrice: 100000000,
            provider: function() {
                return new HDWalletProvider(
                    envProcess.parsed.METAMASK_MNEMONICS,
                    ropstenPath
                )
            },
        },
        polygonMaticMumbai: {
            provider: () => new HDWalletProvider(envProcess.parsed.METAMASK_MNEMONICS, polygonMumbaiPath),
            network_id: 80001,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },
        polygonMaticMainNet: {
            provider: () => new HDWalletProvider(envProcess.parsed.METAMASK_MNEMONICS, polygonMumbaiPath),
            network_id: 80001,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },
        kovan: {
            provider: () => new HDWalletProvider(envProcess.parsed.METAMASK_MNEMONICS, envProcess.parsed.INFURA_KOVAN_HTTPS + envProcess.parsed.INFURA_PRIVATE_KEY),
            network_id: 42,
            gas: 3000000,
            gasPrice: 10000000000
        },

        // main ethereum network(mainnet)
        main: {
            provider: () => new HDWalletProvider(envProcess.parsed.METAMASK_MNEMONICS, envProcess.parsed.INFURA_MAINNET_HTTPS + envProcess.parsed.INFURA_PRIVATE_KEY),
            network_id: 1,
            gas: 3000000,
            gasPrice: 10000000000
        }
    },
    mocha: {
        // timeout: 100000
    },
    compilers: {
        solc: {
            version: "0.8.12", // Fetch exact version from solc-bin (default: truffle's version)
        }
    },
};
