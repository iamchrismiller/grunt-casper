
casper.test.begin('Basic Site Testing With Includes', 1, function suite(test) {

  casper.start('test/fixtures/basicSite.html', function() {
       exports.includeFunction(test);
  });

  casper.run(function() {
    test.done();
  });

});