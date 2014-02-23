/*global exports, require*/

//node
var path = require('path');

//npm
var _ = require('lodash');

/**
 * Initializer For Grunt
 * @param grunt
 */
exports.init = function (grunt) {
  'use strict';

  var casper = {

    testOnlyOptions : {
      pre         : true,
      post        : true,
      includes    : true,
      direct      : true,
      'log-level' : true,
      'fail-fast' : true,
      'concise'   : true,
      'xunit'     : true
    },

    supportedEngines : [
      'phantomjs',
      'slimerjs'
    ],

    _helpers : {

      /**
       * Spawn Casperjs Child Process
       * @param cwd
       * @param args
       * @param next
       */
      spawn : function (cwd, args, next) {
        grunt.verbose.write('Spawning casperjs with args: ' + args + '\n');
        grunt.util.spawn({
          cmd  : 'casperjs',
          args : args,
          opts : {
            cwd   : cwd,
            //see CasperJs output live
            stdio : 'inherit'
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

    },

    execute : function (src, dest, options, args, next) {
      var self = this;
      grunt.verbose.write('Preparing casperjs spawn\n');
      var spawnOpts = [];
      var cwd = options.cwd || process.cwd();
      //add direct flag for printing logs to screen
      if (options['log-level'] && !options.direct) spawnOpts.push('--direct');

      _.forEach(options, function (value, option) {
        if (options.test.length && self._helpers.testOnlyOptions[option]) {
          grunt.log.warn('Option ' + option + ' only available in test mode');
          return;
        }

        if (option) {
          switch (option) {
            case 'test':
              //Test requires specific order logic
              break;
            case 'xunit_out':
              if (typeof options.xunit_out === 'function') {
                //src passed as array reference
                options.xunit = options.xunit_out(src);
              } else {
                options.xunit = options.xunit_out;
              }
              break;
            case 'args' :
              //grunt arguments
              if (options.test.length) {
                grunt.log.warn('Arguments not supported ins test mode');
              } else {
                if (args.length) spawnOpts.push(args);
                value.forEach(function (arg) {
                  spawnOpts.push(arg);
                });
              }
              break;
            //add engine support outside of phantomJS
            case 'engine' :
              if (self.supportedEngines.indexOf(options['engine'])) {
                spawnOpts.push('--engine=' + options['engine']);
              } else {
                grunt.log.warn('Engine ' + options['engine'] + ' not available. [' + self.supportedEngines.join(',') + ']');
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
        src.filter(function (file) {
          if (!grunt.file.exists(file)) {
            grunt.log.warn('Source file "' + file + '" not found.');
            return false;
          }
          return true;
        }).map(function (file) {
            //Make path absolute for SlimerJS
            if (!grunt.file.isPathAbsolute(file)) {
              file = path.join(cwd, file);
            }
              spawnOpts.unshift(file);
          });
      } else {
        spawnOpts.unshift(src);
      }

      if(options.test) {
        spawnOpts.unshift('test');
      }

      //Spawn Child Process
      this._helpers.spawn(cwd, spawnOpts, next);
    }
  };

  return casper;
};
