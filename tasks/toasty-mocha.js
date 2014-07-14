"use strict";

module.exports = function(grunt) {
  var path = require('path'),
    Mocha = require('mocha');

  grunt.registerMultiTask('toastymocha', 'Run tests with mocha', function() {
    var options = this.options(),
      mocha = new Mocha(mocha);

      this.fileSrc.forEach(mocha.addFile.bind(mocha));

      var done = this.async();

      mocha.run(function(errCount, param2) {
        console.log(errCount);
        console.dir(param2);
        done(true);
      });
  });
};
