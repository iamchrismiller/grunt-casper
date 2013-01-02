# grunt-casper

> Run CasperJS Scripts/Functional Tests

## Installation

This task makes use of PhantomJS to drive the casperJS scripts in a headless manner.

You will need to install [phantomjs][], with a fairly simple package [install][]
After [phantomjs][] is installed, you will need to install [casperjs][]

[casperjs] : http://casperjs.org/installation.html
[phantomjs] : http://phantomjs.org/
[install] : http://phantomjs.org/download.html

Now install the grunt task

```shell
npm install grunt-casper --save
```

## Getting Started

CasperJS is a navigation scripting & testing utility for PhantomJS. It eases the process of defining a full navigation scenario and provides useful high-level functions, methods & syntaxic sugar for doing common tasks in a headless browser.

If you haven't used [casperjs][] before, be sure to check out the [Get Started][] guide, as it explains how to create your first test case.

[casperjs]: http://casperjs.org/
[Get Started]: http://casperjs.org/quickstart.html

## casperjs task
_Run this task with the `grunt casperjs` command._

_This task is a [multi task][] so any targets, files and options should be specified according to the [multi task][] documentation._
[multi task]: https://github.com/gruntjs/grunt/wiki/Configuring-tasks


### Options

#### test
Type: ```boolean```
Default: false

Run the casperjs script(s) in test mode. Thus allowing you to split up your tests (casperjs test tests/)

#### save
Type: ```string```
Default: null

Allows you to export the results of the test suite to an xUnit XML file, which is compatible with continuous integration tools such as Jenkins.

```js
options: {
  save : 'tmp/casper'
}
```

#### includes
Type: ```string```
Default: null

Allows you to "include" scripts before executing tests. Allowing you to share test methods, etc.

```js
jst: {
  compile: {
    options: {
      test : true,
      includes : 'path/to/includes.js'
    },
     src: ['path/to/tests.js']
  }
}
```

#### pre
Type: ```string```
Default: null

Allows you to add tests before executing the test suite

```js
jst: {
  compile: {
    options: {
      test : true,
      pre : 'path/to/pre.js'
    },
     src: ['path/to/tests.js']
  }
}
```

#### post
Type: ```string```
Default: null

Allows you to add tests after executing the entire test suite

```js
jst: {
  compile: {
    options: {
      test : true,
      post : 'path/to/post.js'
    },
     src: ['path/to/tests.js']
  }
}
```

#### direct
Type: ```boolean```
Default: false

Casper will output log messages directly to the console

```javascript
options: {
  direct: true
}
```

#### log-level
Type: ```string```
Default: filter under error
Options: debug info warning error

Sets the casperjs logging level


```javascript
options: {
  'log-level': 'error'
}
```

#### fail-fast
Type: ```boolean```

This option with allow for early test suite termination as soon as a first failure is encountered.

```javascript
options: {
  'fail-fast': true
}
```

### Usage Examples

```js

casperjs : {
 functionalTests : {
      options : {
        test : true,
        save : 'tmp/casper',
        includes : 'test/includes/inc.js'
      },
      src: ['test/functionalTests.js']
    }
}

casperjs : {
  options : {
    test : true,
    includes : 'path/to/inc.js',
    post : 'path/to/post.js',
    pre : 'path/to/pre.js',
    'log-level' : 'warning',
    'fail-fast' : true
  },
  src: ['path/to/tests/*_test.js']
}
```


## Release History

 * 2013-01-01   v0.1.0   Initial Release

---

Task submitted by [Chris Miller](http://chris-miller.me)