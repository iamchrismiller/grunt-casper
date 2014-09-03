'use strict';

//npm
var grunt = require('grunt');

//node
var path = require('path'),
    fs = require('fs');

var actualDir = path.join('tmp','casper'),
  expectedDir = path.join('test','expected');

// Is there a way to specify the classname?
function stripRelative(source) {
  return source.replace(/classname="[^"]+"/g,'classname="STRIPPED"')
    .replace(/time="[^"]+"/g,'time="123"')
    .replace(/duration="[^"]+"/g,'duration="123"')
    .replace(/timestamp="[^"]+"/g,'timestamp="123"')
    .replace(/package="[^"]+"/g,'package="STRIPPED"');
}

exports.casper = {

  tests : function(test) {
    var files = [
      'testPass-results.xml',
      'testFail-results.xml',
      'testIncludes-results.xml'
    ];

    test.expect(files.length);

    files.forEach(function(file){
      var actual = grunt.file.read(path.join(actualDir, file));
      var expected = grunt.file.read(path.join(expectedDir, file));

      test.equal(stripRelative(actual), stripRelative(expected), 'should Pass all casper tests');
    });

    test.done();
  },

  screenshot : function(test) {
    test.expect(1);
    test.ok(fs.existsSync('tmp/test.png','Screenshot should exist'));
    test.done();
  }
};
