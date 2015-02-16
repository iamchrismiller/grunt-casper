casper.test.begin('Testing that tests in Folder are working', 3, function suite(test) {

  casper.start('test/fixtures/basicSite.html', function() {
    test.assertTitle('Test Title');
    test.assertExists('h1', 'Header Exists');
    test.assertExists('p', 'P Tag Exists');
  });

  casper.run(function() {
      test.done();
  });

});