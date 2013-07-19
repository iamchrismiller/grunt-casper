var casper = require("casper").create();

casper.start('test/fixtures/basicSite.html');

casper.then(function() {
   this.test.assert(casper.cli.args.indexOf('baz') == 0, 'expected baz to be an argument');
   this.test.assert(typeof casper.cli.options['foo'] !== 'undefined', 'expected foo to be an option');
   this.test.assert(casper.cli.options.foo == 'bar', 'expected foo option to be bar');
 });

casper.run(function() {
  this.test.done(3);
  this.test.renderResults(true, 0, this.cli.get('save') || false);
});