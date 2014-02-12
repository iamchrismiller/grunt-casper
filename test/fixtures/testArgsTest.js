var casper = require("casper").create();

casper.start('test/fixtures/basicSite.html');

casper.then(function() {

  var isFooAnArg = casper.cli.args.indexOf('foo') !== -1,
    isBarAnArg = casper.cli.args.indexOf('bar') !== -1,
    isBazAnArg = casper.cli.args.indexOf('baz') !== -1;

  casper.echo('expecting foo to be an argument : ' + isFooAnArg);
  casper.echo('expecting bar to be an argument : ' + isBarAnArg);
  casper.echo('expecting baz to be an argument : ' + isBazAnArg);

});

casper.run(function() {
  casper.exit();
});
