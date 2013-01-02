/*global module:false*/
module.exports = function (grunt) {
  "use strict";
  grunt.initConfig({

    casperjs: {

      testPass : {
        options : {
          test : true,
          save : 'tmp/casper'
        },
        src: ['test/fixtures/testPass.js']
      },

      testFail : {
        options : {
          test : true,
          save : 'tmp/casper'
        },
        src: ['test/fixtures/testFail.js']
      },

      testIncludes : {
        options : {
          test : true,
          save : 'tmp/casper',
          includes : 'test/fixtures/includes/inc.js'
        },
        src: ['test/fixtures/includes/testIncludes.js']
      }
    },

    nodeunit: {
      tasks: ['test/*_test.js']
    }

  });

  grunt.loadNpmTasks('grunt-casper');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  grunt.registerTask('test', ['casperjs', 'nodeunit']);
  grunt.registerTask('default', ['test']);

};