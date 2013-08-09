/*global module:false*/
module.exports = function (grunt) {
  "use strict";
  grunt.initConfig({
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
          test : false
        },
        src : ['test/fixtures/testScreenshots.js']
      },
      pass : {
        files : {
          'tmp/casper/testPass-results.xml' : ['test/fixtures/testPass.js']
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
      fail : {
        files : {
          'tmp/casper/testFail-results.xml' : ['test/fixtures/testFail.js']
        }
      },
      multiple : {
        src : ['test/fixtures/testPass.js','test/fixtures/testPass2.js'],
        dest : function(input) {
          return 'tmp/multi/' + input.replace('test/fixtures/','').replace(/\.js$/, '.xml');
        }
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

  grunt.registerTask('spawnFailure', function(){
    var options = {
      grunt: true,
      args: ['casper:fail']
    };
    var done = this.async();
    grunt.util.spawn(options, function(){done(true);});
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-internal');
  
  /* can't pass arguments to alias tasks but we can use grunt.task.run */
  grunt.registerTask('casperargs', function() {
    var args = ['casper','args'].concat(Array.prototype.slice.call(arguments));
    grunt.log.writeln(args.join(':'));
    grunt.task.run(args.join(':'));
  });
  
  grunt.registerTask('caspertests', ['clean', 'casper:pass', 'casperargs:baz:--foo=bar', 'casper:multiple', 'casper:includes', 'casper:screenshots','spawnFailure']);

  grunt.registerTask('test', ['jshint', 'caspertests', 'nodeunit']);
  grunt.registerTask('default', ['test']);

};