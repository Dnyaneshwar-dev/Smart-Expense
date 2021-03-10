const smartexpense = artifacts.require("smartexpense");

module.exports = function (deployer) {
  deployer.deploy(smartexpense);
};
