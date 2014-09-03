/*global exports, require, process*/

//node
var path = require('path'),
  fs = require('fs');

//npm
var _ = require('lodash');

//npm install wrapper
var phantomjs = require('phantomjs');
var slimerjs = require('slimerjs');

/**
 * Initializer For Grunt
 * @param grunt
 */
exports.init = function (grunt) {
  'use strict';

  var casper = {

    testableOptions : {
      pre         : true,
      post        : true,
      includes    : true,
      verbose     : true,
      'log-level' : true,
      'fail-fast' : true,
      'concise'   : true,
      'xunit'     : true,
      'no-colors' : true
    },

    supportedEngines : [
      'phantomjs',
      'slimerjs'
    ],


    modulePaths : [
      path.resolve(__dirname, '../../node_modules'), //local
      path.resolve(__dirname, '../../..'), //sibling
      '/usr/local/lib/node_modules' //global
    ],

    /**
     * Spawn Casperjs Child Process
     * @param cwd
     * @param args
     * @param next
     */
    spawn : function (cwd, args, next) {
      grunt.verbose.write('Spawning casperjs with args: ', args, '\n');
      //No CasperBin Found Yet
      var casperBin = null;

      //Set PhantomJS Path only if the file exists, otherwise fall back to ENV
      if (fs.existsSync(phantomjs.path)) {
        grunt.verbose.write('Found PhantomJS Executable', phantomjs.path, '\n');
        process.env["PHANTOMJS_EXECUTABLE"] = phantomjs.path;
      }

      if (fs.existsSync(slimerjs.path)) {
        grunt.verbose.write('Found SlimerJS Executable', slimerjs.path, '\n');
        process.env["SLIMERJS_EXECUTABLE"] = slimerjs.path;
      }


      //Is environment variable `CASPERJS_EXECUTABLE` set?
      if (process.env["CASPERJS_EXECUTABLE"] && fs.existsSync(process.env["CASPERJS_EXECUTABLE"])) {
        casperBin = process.env["CASPERJS_EXECUTABLE"];
      } else {
        //Windows Check
        var isWindows = /^win/.test(process.platform),
          //NPM Module Path
          moduleBinPath = "/casperjs/bin/casperjs";

        //Loop through local/global node_modules dirs
        casper.modulePaths.every(function (path) {
          var moduleBin = path + moduleBinPath + (isWindows ? ".exe" : "");

          if (fs.existsSync(moduleBin)) {
            casperBin = moduleBin;
            //essentially a break
            return false;
          }
          return true;
        });
      }

      //Did we find casper in the module Paths?
      if (casperBin === null) {
        grunt.log.error("CasperJS Binary Not Found, try `npm install`");
        return next(true);
      }

      grunt.verbose.write('Found CasperJS Executable', casperBin);

      //Spawn Casper Process
      grunt.util.spawn({
        cmd  : casperBin,
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
  };


  return {

    execute : function (src, dest, options, args, next) {
      grunt.verbose.write('Preparing casperjs spawn\n');
      var spawnOpts = [];
      var cwd = options.cwd || process.cwd();

      //add verbose flag for printing logs to screen
      if (options['log-level'] && !options.verbose) spawnOpts.push('--verbose');

      _.forEach(options, function (value, option) {
        if (!options.test && casper.testableOptions[option]) {
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
              if (args && args.length) spawnOpts.push(args);
              value.forEach(function (arg) {
                spawnOpts.push(arg);
              });
              break;
            //add engine support outside of phantomJS
            case 'engine' :
              if (casper.supportedEngines.indexOf(options['engine']) !== -1) {
                spawnOpts.push('--engine=' + options['engine']);
              } else {
                grunt.log.warn('Engine ' + options['engine'] + ' not available. [' + casper.supportedEngines.join(',') + ']');
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

      if (options.test) {
        spawnOpts.unshift('test');
      }

      //Spawn Child Process
      casper.spawn(cwd, spawnOpts, next);
    }
  };
};
