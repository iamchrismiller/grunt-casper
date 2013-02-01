var casper = require("casper").create();

casper.start('test/fixtures/basicSite.html');

casper.then(function() {
   this.test.assertTitle('Test Title');
   this.test.assertExists('h1', 'Header Exists');
   this.test.assertExists('p', 'P Tag Exists');
 });

casper.run(function() {
  this.test.done(3);
  this.test.renderResults(true, 0, this.cli.get('save') || false);
});