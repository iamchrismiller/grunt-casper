var casper = require("casper").create();

casper.start('test/fixtures/basicSiteWithImages.html');

casper.then(function() {
  this.capture('tmp/test.png');
});

casper.run();

