
casper.test.begin('Basic Site Testing Fail Fast Tests', 3, function suite(test) {

  casper.start('test/fixtures/basicSite.html', function() {
    test.assertTitle('Test Title');
    test.assertExists('h1', 'Header Exists');
    test.assertExists('p', 'P Tag Exists');
    //Fail
    test.assertExists('span', 'Span Tag Does Not Exist - Should Fail');
  });

  casper.run(function() {
    test.done();
  });

});