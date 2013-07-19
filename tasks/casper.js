
"use strict";

module.exports = function (grunt) {

  //casper spawn helpers
  var casperlib = require('./lib/casper').init(grunt);

  grunt.registerMultiTask('casper', 'execute casperjs tasks', function () {

    var args = Array.prototype.slice.call(arguments);
    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = helpers.options(this, {});
    var done = this.async();

    grunt.verbose.writeflags(options, 'Options');
    grunt.verbose.writeflags(args, 'Arguments');

    this.files.forEach(function (file) {
      if (file.src.length) {
        grunt.util.async.forEachSeries(file.src,function (srcFile, next) {
          casperlib.spawnCasper(srcFile, file.dest, options, args, next, done);
        }, function (err) {
          if (err) grunt.log.write('error:', err);
          done();
        });
      } else {
        grunt.fail.warn('Unable to compile; no valid source files were found.');
      }
    });
  });
};