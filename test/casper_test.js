'use strict';

var grunt = require('grunt');
var fs = require('fs');

exports.casper = {

  passTest : function(test) {
    'use strict';
    test.expect(1);

    var actual = grunt.file.read('tmp/casper/testPass-results.xml');
    var expected = grunt.file.read('test/expected/testPass-results.xml');
    test.equal(actual, expected, 'should Pass all casper tests');

    test.done();
  },

  failTest : function(test) {
    'use strict';
    test.expect(1);

    var actual = grunt.file.read('tmp/casper/testFail-results.xml');
    var expected = grunt.file.read('test/expected/testFail-results.xml');
    test.equal(actual, expected, 'should Fail one casper test');

    test.done();
  },

  includes : function(test) {
    'use strict';
    test.expect(1);

    var actual = grunt.file.read('tmp/casper/testIncludes-results.xml');
    var expected = grunt.file.read('test/expected/testIncludes-results.xml');
    test.equal(actual, expected, 'should include (includes) files');

    test.done();
  }

};