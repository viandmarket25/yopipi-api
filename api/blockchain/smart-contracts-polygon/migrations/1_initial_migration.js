// ::: find the contract
//const Migrations = artifacts.require("Migrations");
//const newContractMigration = artifacts.require("./newContract.sol");
const ropstenNftContractMigration = artifacts.require("./ropstenNftContract.sol");
module.exports = function(deployer) {
    //deployer.deploy(Migrations);
    //deployer.deploy(newContractMigration);
    deployer.deploy(ropstenNftContractMigration);
    //deployer.deploy(A, {overwrite: false});
};