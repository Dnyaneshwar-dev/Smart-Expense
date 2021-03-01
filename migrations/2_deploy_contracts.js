const TodoList = artifacts.require("smartexpense");

module.exports = function (deployer) {
  deployer.deploy(TodoList);
};
