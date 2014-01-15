var casper = require("casper").create();

casper.start('test/fixtures/basicSite.html');

var isBazAnArg = casper.cli.args.indexOf('baz') == 0;
var isFooAnOption = typeof casper.cli.options['foo'] !== 'undefined';
var isFooOptionBar = casper.cli.options.foo == 'bar';

casper.then(function() {
  casper.echo('expected baz to be an argument : ' + isBazAnArg);
  casper.echo('expected foo to be an option : ' + isFooAnOption);
  casper.echo('expected foo option to be bar : ' + isFooOptionBar);
});

casper.run(function() {
  casper.exit();
});
