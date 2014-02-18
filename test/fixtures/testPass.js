
casper.test.begin('Basic Site Testing Pass Tests', 3, function suite(test) {

  casper.start('/srv/playground/grunt-casper/test/fixtures/basicSite.html', function() {

    test.assertTitle('Test Title');
    test.assertExists('h1', 'Header Exists');
    test.assertExists('p', 'P Tag Exists');

  });

  casper.run(function() {
    test.done();
  });

});