"use strict";

module.exports = function(grunt) {
  var path = require('path'),
    Mocha = require('mocha');

  grunt.registerMultiTask('toastymocha', 'Run tests with mocha', function() {
    var options = this.options(),
      mocha = new Mocha(mocha);

      this.filesSrc.forEach(mocha.addFile.bind(mocha));

      var done = this.async();

      try {
        mocha.run(function(errCount, param2) {
          console.log(errCount);
          console.dir(param2);
          done(true);
        });
      } catch(e) {
        console.dir(e);
        done(true);
      }
  });
};
