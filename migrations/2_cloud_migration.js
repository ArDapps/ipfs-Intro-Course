const Cloud = artifacts.require("Cloud");

module.exports = function (deployer) {
  deployer.deploy(Cloud);
};
