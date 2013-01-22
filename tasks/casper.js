module.exports = function (grunt) {

  //casper spawn helpers
  var casperlib = require('./lib/casper').init(grunt);

  //@TODO backwards compat - remove after grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('casper', 'execute casperjs tasks', function () {

    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = helpers.options(this, {});
    var done = this.async();

    grunt.verbose.writeflags(options, 'Options');

    //@TODO backwards compat - remove after grunt v0.4 is released
    grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    grunt.util.async.forEachSeries(this.files, function (file, next) {
      srcFiles = grunt.file.expandFiles(file.src);
      if (srcFiles.length) {
        if (options.test) {
          casperlib.spawnCasper(srcFiles, options, next);
        } else {
          srcFiles.forEach(function (srcFile) {
            casperlib.spawnCasper(srcFile, options, next);
          });
        }
      } else {
        grunt.fail.warn('Unable to compile; no valid source files were found.');
      }
    }, function (err) {
      if (err) grunt.log.write('error:', err);
      done();
    });
  });
};