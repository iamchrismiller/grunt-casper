exports.init = function (grunt) {
  'use strict';

  var path = require('path');
  var exports = {};

  //supported casper options
  var supportedScriptOptions = {
    //must get the save from cli in each script
    //test.renderResults(true, 0, this.cli.get('save') || false);
    save : function (outputDir, casperFile) {
      if (outputDir.substr(-1) !== '/') outputDir += '/';
      console.log('--save=' + outputDir + casperFile.replace('.js', '') + '-results.xml');
      return '--save=' + outputDir + casperFile.replace('.js', '') + '-results.xml'
    }
  };

  var supportedTestOptions = {
    save : supportedScriptOptions.save,
    pre         : true,
    post        : true,
    includes    : true,
    direct      : true,
    'log-level' : true,
    'fail-fast' : true
  };

  function spawn(options,next) {
    grunt.verbose.write('Spawning casperjs with options: ' + options + '\n');
    grunt.util.spawn({
      cmd  : 'casperjs',
      args : options
    }, function (errorObj, result, code) {
      if (result.stdout) grunt.log.write(result.stdout + '\n\n');
      if (result.stderr) grunt.log.write(result.stderr + '\n\n');
      next();
    });
  }

  exports.spawnCasper = function(src, options, next) {
    grunt.verbose.write('Preparing casperjs spawn\n');
    var spawnOpts = [], supported;

    //casper test
    if (options.test) {
      spawnOpts.push('test');
      supported = supportedTestOptions;
      src.forEach(function(file) {
        spawnOpts.push(path.relative(process.cwd(), file));
      });
      delete(options.test);
    } else {
      //casper script
      spawnOpts.push(src);
      supported = supportedScriptOptions;
    }

    //add direct flag for printing logs to screen
    if (options['log-level'] && !options.direct) spawnArgs.push('--direct');

    for (var option in options) {
      if (supported[option]) {
        if (grunt.util._.isFunction(supported[option])) {
          spawnOpts.push(supported[option](options[option], path.basename(src)));
        } else {
          var currentOption = '--' + option + '=' + options[option];
          grunt.verbose.write('Adding Option ' + currentOption + '\n');
          spawnOpts.push(currentOption);
        }
      } else {
        grunt.log.write("CasperJS Option --" + option + ' not supported\n');
      }
    }
    spawn(spawnOpts,next);
  };

  return exports;
};