var casper = require("casper").create();

casper.start('test/fixtures/basicSite.html');

casper.then(function() {
  this.capture('tmp/test.png');
});

casper.run();

