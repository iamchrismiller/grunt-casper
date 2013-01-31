
var casper = require("casper").create();

casper.includeFunction = function includeFunction() {
  this.test.assertTrue(true, 'testFunction-assertion');
};
