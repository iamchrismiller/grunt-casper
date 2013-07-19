exports.init = function (grunt) {
  'use strict';

  var exports = {};

  var testOnlyOptions = {
    pre         : true,
    post        : true,
    includes    : true,
    direct      : true,
    'log-level' : true,
    'fail-fast' : true
  };

  function spawn(options,next,done) {
    grunt.verbose.write('Spawning casperjs with options: ' + options + '\n');
    grunt.util.spawn({
      cmd  : 'casperjs',
      args : options
    }, function (errorObj, result, code) {
      if (code > 0) {
        grunt.log.error(result.stdout);
        return done(false);
      }
      if (result.stdout) grunt.verbose.write(result.stdout + '\n\n');
      if (result.stderr) grunt.verbose.write(result.stderr + '\n\n');
      next();
    });
  }

  exports.spawnCasper = function(src, dest, options, args, next, done) {
    grunt.verbose.write('Preparing casperjs spawn\n');
    var spawnOpts = [];


    if (options.test) {
      spawnOpts.push('test');
    } else {
      grunt.util._.forEach(options, function(value, option){
        if (testOnlyOptions[option]) {
          grunt.log.warn('Option ' + option + ' only available in test mode');
        }
      });
    }

    //add direct flag for printing logs to screen
    if (options['log-level'] && !options.direct) spawnOpts.push('--direct');

    grunt.util._.forEach(options,function(value, option) {
      if (option === 'test') return;
      var currentOption = '--' + option + '=' + value;
      grunt.verbose.write('Adding Option ' + currentOption + '\n');
      spawnOpts.push(currentOption);
    });

    if (dest) {
      if (typeof dest === 'function') {
        dest = dest(src);
      }
      spawnOpts.push('--save=' + dest);
    }

    spawnOpts.push(src);
    
    if (args.length > 0) {
      if (options.test) {
        grunt.log.warn('Arguments not supported for test mode');
      } else {
        spawnOpts = spawnOpts.concat(args);
      }
    }

    spawn(spawnOpts,next,done);
  };

  return exports;
};