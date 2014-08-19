
casper.test.begin('Basic Site Testing Pass Tests', 3, function suite(test) {

  casper.start('test/fixtures/basicSite.html', function() {

    test.assertTitle('Test Title');
    test.assertExists('h1', 'Header Exists');
    test.assertExists('p', 'P Tag Exists');

  });

  casper.run(function() {
    setTimeout(function() {
      test.done();
    }, 3000);
  });

});