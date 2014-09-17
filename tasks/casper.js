/*global require */
"use strict";

//npm
var Duration = require("duration");


module.exports = function (grunt) {

  //Retrieve Casper Lib
  var casperLib = require('./lib/casper').init(grunt);


  grunt.registerMultiTask('casper', 'execute casperjs tasks', function () {
    var args = Array.prototype.slice.call(arguments),
      options = this.options(),
      done = this.async(),
      taskName = this.nameArgs,
      startTime = new Date();

    //Once Current Task is complete
    //Log Duration and Finish
    function taskComplete(error) {

      var msg = "Casper Task '" + taskName + "' took ~" + new Duration(startTime).milliseconds + "ms to run";
      grunt.log.success(msg);
      if (grunt.util.kindOf(error) != 'null') {
        return done(false);
      }
      done();
    }

    grunt.verbose.writeflags(args, 'Arguments');

    if (options.parallel) {
      //https://github.com/gruntjs/grunt-contrib-sass/issues/16
      //Set Default Concurrency at 5 (Supposed Memory Leak > 10)
      var concurrency = 5;
      if (options.concurrency) {
        if (options.concurrency > 10 ) {
          grunt.verbose.writeln('Concurrency Too High. Max 10, updating to 10.');
          concurrency = 10;
        } else if (options.concurrency < 1) {
          grunt.verbose.writeln('Concurrency Too Low. Min 1, updating to default 5.');
        } else {
          concurrency = options.concurrency;
        }
        //Don't Pass this through to spawn
        delete options.concurrency;
      }

      if (grunt.option('ignore-fail')) {
        var queue_errors = [];
        var queue = grunt.util.async.queue(function (task, callback) {
            casperLib.execute(task.file, task.dest !== 'src' ? task.dest : null, options, args, function(err) {
              callback(err);
            });
        }, concurrency);

        queue.drain = function() {
          taskComplete(queue_errors);
        };
      }
    }

    grunt.util.async.forEachSeries(this.files, function(file, iteratorCb) {

      if (file.src.length) {
        //Allow Files in each task to be run concurrently
        if (options.parallel) {
          //Don't Pass this through to spawn
          delete options.parallel;

          //Run Tests In Parallel
          if (file.src) {
            if (grunt.option('ignore-fail')) {
              file.src.forEach(function(srcFile) {
                queue.push({file: srcFile, dest: file.dest}, function (err) {
                    queue_errors.push(err);
                });
              });
            } else {
              grunt.util.async.forEachLimit(file.src, concurrency, function(srcFile, next) {
                //Spawn Child Process
                casperLib.execute(srcFile, file.dest !== 'src' ? file.dest : null, options, args, next);
              }, function(err) {
                if (err) grunt.log.writeln('error:', err);
                //Call Done and Log Duration
                iteratorCb(err);
              });
            }

          }
        } else {

          if (file.src) {
            casperLib.execute(file.src, file.dest, options, args, function(err) {
              //Call Done and Log Duration
              iteratorCb(err);
            });
          }
        }
      } else {
        grunt.fail.warn('Unable to compile; no valid source files were found.');
      }

    }, function(err) {
      taskComplete(err);
    });

  });
};