/*global require */
"use strict";

module.exports = function (grunt) {

  //casper spawn helpers
  var casperlib = require('./lib/casper').init(grunt);
  //get the duration of each casper task
  var Duration = require("duration");

  grunt.registerMultiTask('casper', 'execute casperjs tasks', function () {

    var args = Array.prototype.slice.call(arguments),
      options = this.options(),
      done = this.async(),
      taskName = this.nameArgs,
      startTime = new Date();

    //Once Current Task is complete
    //Log Duration and Finish
    function taskComplete() {
      var msg = "Casper Task '" + taskName + "' took ~" + new Duration(startTime).milliseconds + "ms to complete";
        grunt.log.success(msg);
        done();
    }

    grunt.verbose.writeflags(options, 'Options');
    grunt.verbose.writeflags(args, 'Arguments');

    this.files.forEach(function (file) {

      if (file.src.length) {
        //Allow Files in each task to be run concurrently
        if (options.parallel) {
          //Don't Pass this through to spawn
          delete options.parallel;
          //Set Default Concurrency at 5 (Supposed Memory Leak > 10)
          var concurrency = 5;

          if (options.concurrency) {
            if (concurrency > 10) {
              grunt.verbose.writeln('Concurrency Too High. Max 10, updating to 10.');
              concurrency = 10;
            } else if (concurrency < 1) {
              grunt.verbose.writeln('Concurrency Too Low. Min 1, updating to default 5.');
            } else {
              concurrency = options.concurrency;
            }
            //Don't Pass this through to spawn
            delete options.concurrency;
          }
          //Run Tests In Parallel
          if (file.src) {
            grunt.util.async.forEachLimit(file.src, concurrency, function(srcFile, next) {
              //Spawn Child Process
              casperlib.spawnCasper(srcFile, file.dest, options, args, next);
            }, function(err) {
              if (err) grunt.log.write('error:', err);
              //Call Done and Log Duration
              taskComplete();
            });
          }
        } else {
          if (file.src) {
            casperlib.spawnCasper(file.src, file.dest, options, args, function() {
              //Call Done and Log Duration
              taskComplete();
            });
          }
        }
      } else {
        grunt.fail.warn('Unable to compile; no valid source files were found.');
      }
    });
  });
};