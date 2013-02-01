
casper.test.comment("Casper includes test started");

//defined in inc.js
casper.includeFunction();

casper.test.done(1);
casper.test.renderResults(true, 0, casper.cli.get('save') || false);