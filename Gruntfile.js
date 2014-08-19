/*global module, process*/

//For Tests Override Casper Dir
process.env.CASPERJS_EXECUTABLE = require('path').resolve(
  __dirname,
  'node_modules/casperjs/bin/casperjs',
  (/^win/.test(process.platform) ?  ".exe" : "")
);


module.exports = function (grunt) {
  "use strict";
  grunt.initConfig({

    opts : {
      port : 'fff'
    },

    jshint: {
      options : {
        jshintrc : '.jshintrc'
      },
      all : ['tasks/**/*.js', 'test/*.js', 'Gruntfile.js']
    },
    casper: {
      options : {
        test : true
      },

      screenshots : {
        options : {
          test : false,
          'load-images' : 'no'
        },
        src : ['test/fixtures/testScreenshots.js']
      },

      passEngine : {
        src : ['test/fixtures/testPassEngine.js']
      },

      pass : {
        options : {
          "log-level" : "debug",
          "test" : true
        },
        files : {
          'tmp/casper/testPass-results.xml' : ['test/fixtures/testPass.js']
        }
      },

      passMultiple : {
        src : ['test/fixtures/testPass*.js']
      },

      parallel : {
        options : {
          parallel : true,
          concurrency: 5,
          concise : true
        },
        files : {
          src : [
            'test/fixtures/testParallel*.js'
          ]
        }
       },

      multipleFiles : {
        options : {
          parallel : true,
          concurrency: 5,
          concise : true
        },
        files : {
          'tmp/casper/multipleFiles-results.xml' : ['test/fixtures/testPass.js'],
          'tmp/casper/multipleFiles-results2.xml' : ['test/fixtures/testTimeout.js']
        }
      },

      args: {
        options: {
          test: false
        },
        files: {
          'tmp/casper/testArgs-results.xml': ['test/fixtures/testArgs.js']
        }
      },

      argsTest: {
        options: {
          test: false,
          args : [
            "foo",
            "bar",
            "baz"
          ]
        },
        files: {
          'tmp/casper/testArgs-results.xml': ['test/fixtures/testArgsTest.js']
        }
      },

      fail : {
        files : {
          'tmp/casper/testFail-results.xml' : ['test/fixtures/testFail.js']
        }
      },

      failFast : {
        options : {
          'fail-fast' : true
        },
        src : ['test/fixtures/testPass.js', 'test/fixtures/testFail.js', 'test/fixtures/testPass2.js'],
        dest : 'tmp/casper/testFailFast-results.xml'
      },

      multiple : {
        src : ['test/fixtures/testPass.js','test/fixtures/testPass2.js'],
        dest : 'tmp/multi/testResults.xml'
      },

      includes : {
        options : {
          includes : 'test/fixtures/includes/inc.js'
        },
        files : {
          'tmp/casper/testIncludes-results.xml' : ['test/fixtures/includes/testIncludes.js']
        }
      }
    },

    clean : {
      tmp : ['tmp']
    },

    nodeunit: {
      tasks: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  /* can't pass arguments to alias tasks but we can use grunt.task.run */
  grunt.registerTask('casperargs', function() {
    var args = ['casper','args'].concat(Array.prototype.slice.call(arguments));
    grunt.log.writeln(args);
    grunt.task.run(args.join(':'));
  });

  grunt.registerTask('spawnFailure', function(){
    var options = {
      grunt: true,
      args: ['casper:fail']
    };
    var done = this.async();
    grunt.util.spawn(options, function(){done(true);});
  });

  grunt.registerTask('runtests', [
    'clean',
    'casper:argsTest',
    'casperargs:baz:--foo=bar',
    'casper:pass',
    'casper:passEngine',
    'casper:multiple',
    'casper:includes',
    'casper:screenshots',
    'casper:parallel',
    'spawnFailure'
  ]);

  grunt.registerTask('test', ['jshint', 'runtests', 'nodeunit']);

  //Should Run Locally To Test Fail Cases - Fails Travis/Grunt
  grunt.registerTask('testFail', ['casper:fail', 'casper:failFast']);
  grunt.registerTask('default', ['test']);
};