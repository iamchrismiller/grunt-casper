exports.init = function (grunt) {
  'use strict';

  var exports = {};

  var testOnlyOptions = {
    pre         : true,
    post        : true,
    includes    : true,
    direct      : true,
    'log-level' : true,
    'fail-fast' : true,
    'xunit'     : true
  };

  function spawn(cwd,options,next,done) {
    grunt.verbose.write('Spawning casperjs with options: ' + options + '\n');
    grunt.util.spawn({
      cmd  : 'casperjs',
      args : options,
      opts : {
        cwd : cwd,
        //see CasperJs output live
        stdio: 'inherit'
      }
    }, function (errorObj, result, code) {
      if (code > 0) {
        grunt.log.error(result.stdout);
        return done(false);
      }
      if (result.stdout) grunt.log.write(result.stdout + '\n\n');
      if (result.stderr) grunt.log.write(result.stderr + '\n\n');
      next();
    });
  }

  exports.spawnCasper = function(src, dest, options, args, next, done) {
    grunt.verbose.write('Preparing casperjs spawn\n');
    var spawnOpts = [];
    var cwd = options.cwd || process.cwd();

    if (options.xunit_out) {
      if (typeof options.xunit_out === 'function') {
        options.xunit = options.xunit_out(src);
      } else {
        options.xunit = options.xunit_out;
      }
    }

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
      if (option === 'xunit_out') return;
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

    spawn(cwd,spawnOpts,next,done);
  };

  return exports;
};
