# grunt-casper [![Build Status](https://secure.travis-ci.org/iamchrismiller/grunt-casper.png?branch=master)](http://travis-ci.org/iamchrismiller/grunt-casper)

> Run CasperJS Scripts/Functional Tests

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


## casperjs task
_Run this task with the `grunt casperjs` command._

_This task is a [multi task](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) so any targets, files and options should be specified according to the [multi task][] documentation._

### Options

#### Grunt 'dest'
Type: `String` `Function`

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

#### direct
Type: `Boolean`
Default: false

Output log messages directly to the console

#### log-level
Type: `String`
Default: `error`
Options: `debug` `info` `warning` `error`

Sets the casperjs logging level

#### fail-fast
Type: `boolean`
Default: false

Terminate as soon as a first failure is encountered.

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

Global options and custom destination

```js
casper : {
  options : {
    test : true,
    includes : 'path/to/inc.js',
    post : 'path/to/post.js',
    pre : 'path/to/pre.js',
    'log-level' : 'warning',
    'fail-fast' : true
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

`casperjs test.js baz --foo=bar`

Grunt tasks can accept additional arguments and grunt-casper will pass these through to CasperJS, for instance

`grunt casper:yourTask:baz:--foo=bar`

will pass `baz` as an argument and `foo` as an option with a value of `bar`.  These are then available in your CasperJS script 

```js
casper.cli.args.indexOf('baz'); // 0
casper.cli.options.foo; //bar
```

Arguments and options will be ignored in `test` mode as CasperJS does not support them.

## Release History


 * 2013-10-08   v0.1.4   Merged pull request - cwd spawn option
 * 2013-09-05   v0.1.3   Fixed logging from grunt.verbose -> grunt.log
 * 2013-08-10   v0.1.2   Added xunit support
 * 2013-02-01   v0.1.1   Update Task To Run With grunt0.4.0rc7
 * 2013-01-01   v0.1.0   Initial Release

---

Task submitted by [Chris Miller](http://chris-miller.me)
