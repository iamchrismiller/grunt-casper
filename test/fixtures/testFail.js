var casper = require("casper").create();

casper.start('test/fixtures/basicSite.html');

casper.then(function() {
   this.test.assertTitle('Test Title');
   this.test.assertExists('h1', 'Header Exists');
   this.test.assertExists('p', 'P Tag Exists');
   //Fail Case
   this.test.assertExists('span', 'Should Fail - Span Tag Does Not Exist');
 });

casper.run(function() {
  this.test.done(4);
  this.test.renderResults(true, 0, this.cli.get('save') || false);
});
