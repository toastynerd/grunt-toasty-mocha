"use strict";

var MochaWrapper = require('./lib/mocha-wrapper');

module.exports = function(grunt) {
  grunt.registerMultiTask('toastymocha', 'Run tests with mocha', function() {
    var options = this.options();
    var files = this.filesSrc;

    var done = this.async();

    var mochaWrapper = new MochaWrapper({files: files, options: options});

    mochaWrapper.run(done);
  });
};
