var casper = require("casper").create();

casper.start('test/fixtures/basicSite.html');

casper.then(function() {
  this.capture('tmp/test.png');
});

casper.run(function() {
  this.test.renderResults(true, 0, this.cli.get('save') || false);
});

