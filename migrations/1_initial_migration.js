var Migrations = artifacts.require("./HelloToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
