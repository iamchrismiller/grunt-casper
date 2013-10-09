casper.test.begin('Basic Site Testing Fail Tests', 4, function suite(test) {

  casper.start('test/fixtures/basicSite.html', function() {

    test.assertTitle('Test Title');
    test.assertExists('h1', 'Header Exists');
    test.assertExists('p', 'P Tag Exists');
    //Fail Case
    test.assertExists('span', 'Should Fail - Span Tag Does Not Exist');

  });

  casper.run(function() {
    test.done();
  });

});