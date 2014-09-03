# grunt-casper [![Build Status](https://secure.travis-ci.org/iamchrismiller/grunt-casper.svg?branch=master)](http://travis-ci.org/iamchrismiller/grunt-casper)  [![Dependency Status](https://david-dm.org/iamchrismiller/grunt-casper.svg)](https://david-dm.org/iamchrismiller/grunt-casper.png) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/iamchrismiller/grunt-casper/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

> Run CasperJS Scripts/Functional Tests

If You need Casper 1.0 Support - Please Check out this [tag](https://github.com/iamchrismiller/grunt-casper/tree/1.0)
*@note : You no longer need PhantomJS/CasperJS binaries installed. They are now managed by npm*

## Installation

This task makes use of PhantomJS to drive the casperJS scripts in a headless manner.

You will need to install [phantomjs](http://phantomjs.org/), with a fairly simple package [install](http://phantomjs.org/download.html)
After [phantomjs](http://phantomjs.org/) is installed, you will need to install [casperjs](http://casperjs.org/installation.html)

Now install the grunt task

```shell
npm install grunt-casper --save
```

## Getting Started

CasperJS is a navigation scripting & testing utility for PhantomJS. It eases the process of defining a full navigation scenario and provides useful high-level functions, methods & syntaxic sugar for doing common tasks in a headless browser.

If you haven't used [casperjs](http://casperjs.org/) before, be sure to check out the [Get Started](http://casperjs.org/quickstart.html) guide, as it explains how to create your first test case.


## casper task
_Run this task with the `grunt casper` command._

_This task is a [multi task](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) so any targets, files and options should be specified according to the [multi task][] documentation._

### Options

#### Grunt 'dest'
Type: `String` || `Function`

The 'dest' option in Grunt's configuration is passed as the --save option to casper, allowing you to access
   your destination programmatically. If passed as a function, the return value will be used.

#### test
Type: `Boolean`
Default: false

Run the casperjs script(s) in test mode. Thus allowing you to split up your tests (casperjs test tests/)

#### includes
Type: `String`
Default: undefined

Comma separated list of scripts to "include" before executing tests.

#### pre
Type: `String`
Default: undefined

Scripts to be executed before the test suite

#### post
Type: `String`
Default: undefined

Scripts to be executed after the test suite

#### verbose
Type: `Boolean`
Default: false

Output log messages directly to the console

#### log-level
Type: `String`
Default: `error`
Options: `debug` `info` `warning` `error`

Sets the casperjs logging level

#### fail-fast
Type: `Boolean`
Default: false

Terminate as soon as a first failure is encountered.

#### concise
Type: `Boolean`
Default: false

Create a more concise output of the test suite.


#### engine
Type: `String`
Default: phantomjs

Specify Browser Engine (phantomjs|slimerjs)

#### concurrency
Type: `Number`
Default: How many test files to run concurrently (1-10)

#### parallel
Type: `Boolean`
Default: Run tests in Parallel instead of Series

### Usage Examples

Basic usage
```js
casper : {
 yourTask : {
    options : {
      test : true
    },
    files : {
      'xunit/casper-results.xml' : ['test/functionalTests.js']
    }
  }
}
```

Basic Parallel usage
```js
casper : {
 yourTask : {
    options : {
      test : true,
      parallel : true,
      concurrency : 5
    },
    files : {
      'xunit/casper-results.xml' : ['test/functionalTests.js'],
      'xunit/casper-results-2.xml' : ['test/functionalTests2.js'],
    }
  }
}
```

Global options and custom destination

```js
casper : {
  options : {
    test : true,
    includes : 'path/to/inc.js',
    post : 'path/to/post.js',
    pre : 'path/to/pre.js',
    'log-level' : 'warning',
    'fail-fast' : true,
    concise : true,
    engine : 'slimerjs'
  },
  yourTask : {
    src: ['path/to/tests/*_test.js'],
    dest : function(input) {
      return input.replace(/\.js$/,'.xml');
    }
  }
}
```

### Options and Arguments
CasperJS supports options and arguments on the [command line](http://docs.casperjs.org/en/latest/cli.html).

`casperjs script.js baz --foo=bar`

Grunt tasks can accept additional arguments and grunt-casper will pass these through to CasperJS, for instance

`grunt casper:yourTask:baz:--foo=bar`

will pass `baz` as an argument and `foo` as an option with a value of `bar`.  These are then available in your CasperJS script 

```js
casper.cli.args.indexOf('baz'); // 0
casper.cli.options.foo; //bar
```

Arguments can also be specified in the Task Options Object

```js
  casper : {
    options : {
      args : ['foo', 'bar']
    }
  }
```

Arguments and options will be ignored in `test` mode as CasperJS does not support them.

## PhantomJS / CasperJS Binaries

You may also override the location of the PhantomJS and CasperJS binaries like so:

process.env.PHANTOMJS_EXECUTABLE = '/path/to/phantomjs';
process.env.CASPERJS_EXECUTABLE = '/path/to/casperjs';

The CasperJS Binary, by default, is loaded from the local ./node_modules directory and has a fallback to look in the
global node_modules directory (/usr/local/lib/node_modules)



## Release History

 * 2014-08-19   v0.4.1   Expose Slimerjs binary export
 * 2014-08-19   v0.4.0   Refactored Fail cases
 * 2014-07-16   v0.3.10  Added local binary module path
 * 2014-06-09   v0.3.9   Refactored exports and binary module loading
 * 2014-05-12   v0.3.8   Removed test arguments constraint
 * 2014-04-24   v0.3.7   Merge pull request #39 add no-colors option
 * 2014-04-21   v0.3.6   Fixed issue with testableOptions
 * 2014-03-20   v0.3.5   Fixed issue with engine indexOf conditional
 * 2014-03-12   v0.3.4   Merge pull request #36 check PhantomJS path
 * 2014-03-06   v0.3.3   Cleaned up Cross Platform Binary Location
 * 2014-03-05   v0.3.2   Fixed CasperJS Binary for windows platform
 * 2014-03-03   v0.3.1   Export CasperJS binary to node_module/.bin
 * 2014-02-23   v0.3.0   CasperJS npm managed binary
 * 2014-02-23   v0.2.7   PhantomJS install via wrapper
 * 2014-02-22   v0.2.6   Parallel exit logic
 * 2014-02-22   v0.2.5   Changed deprecated 1.1 direct flag to verbose
 * 2014-02-22   v0.2.4   Fixed test option position in array
 * 2014-02-17   v0.2.3   Added engine support (phantomjs, slimerjs)
 * 2014-02-11   v0.2.2   Added args option for casper args, added concise option support
 * 2014-01-24   v0.2.1   Refactored exit logic
 * 2014-01-14   v0.2.0   Refactored non-parallel Runs, fixing --fail-fast parameter   
 * 2013-11-22            Refactored task dependencies, added parallel option and task duration
 * 2013-10-08   v0.1.4   Merged pull request - cwd spawn option
 * 2013-09-05   v0.1.3   Fixed logging from grunt.verbose -> grunt.log
 * 2013-08-10   v0.1.2   Added xunit support
 * 2013-02-01   v0.1.1   Update Task To Run With grunt0.4.0rc7
 * 2013-01-01   v0.1.0   Initial Release

---

Task submitted by [Chris Miller](http://chris-miller.me)
