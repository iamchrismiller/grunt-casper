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
    'concise'   : true,
    'xunit'     : true
  };

  function spawn(cwd,args,next) {
    grunt.verbose.write('Spawning casperjs with args: ' + args + '\n');

    grunt.util.spawn({
      cmd  : 'casperjs',
      args : args,
      opts : {
        cwd : cwd,
        //see CasperJs output live
        stdio: 'inherit'
      }
    }, function (errorObj, result, code) {

      if (code > 0) {
        grunt.log.error(result.stdout);
        return next(true);
      }

      if (result.stdout) grunt.log.write(result.stdout + '\n\n');
      if (result.stderr) grunt.log.write(result.stderr + '\n\n');
      next();
    });
  }

  exports.spawnCasper = function(src, dest, options, args, next) {
    grunt.verbose.write('Preparing casperjs spawn\n');
    var spawnOpts = [];
    var cwd = options.cwd || process.cwd();

    if (options.xunit_out) {
      if (typeof options.xunit_out === 'function') {
        //src passed as array reference
        options.xunit = options.xunit_out(src);
      } else {
        options.xunit = options.xunit_out;
      }
    }

    //add direct flag for printing logs to screen
    if (options['log-level'] && !options.direct) spawnOpts.push('--direct');

    grunt.util._.forEach(options,function(value, option) {
      if (options.test.length && testOnlyOptions[option]) {
        grunt.log.warn('Option ' + option + ' only available in test mode');
        return;
      }

      if (option) {
        switch(option) {
          case 'test':
            if (value) {
              spawnOpts.push(option);
            }
            break;
          case 'xunit_out':
            return;
          case 'args' :
            //grunt arguments
            if (options.test.length) {
              grunt.log.warn('Arguments not supported ins test mode');
            } else {
              if (args.length) spawnOpts.push(args);
              value.forEach(function(arg) {
                spawnOpts.push(arg);
              });
            }
            break;
          default:
            var currentOption = '--' + option + '=' + value;
            grunt.verbose.write('Adding Option ' + currentOption + '\n');
            spawnOpts.push(currentOption);
        }
      }
    });

    if (dest) {
      if (typeof dest === 'function') {
        dest = dest(src);
      }
      spawnOpts.push('--xunit=' + dest);
    }

    if (typeof src === 'object') {
      src.filter(function(file) {
        if (!grunt.file.exists(file)) {
          grunt.log.warn('Source file "' + file + '" not found.');
          return false;
        }
        return true;
      }).map(function(file) {
          if (options.test) spawnOpts.splice(1,0,file);
          else spawnOpts.unshift(file);
      });
    } else if (options.test) {
      spawnOpts.splice(1,0,src);
    } else {
      spawnOpts.unshift(src);
    }

    spawn(cwd,spawnOpts,next);
  };

  return exports;
};
