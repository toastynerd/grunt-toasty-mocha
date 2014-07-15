/* the use of mochaWrapper to catch
errors is based off of this repo
https://github.com/pghalliday/grunt-mocha-test
which is in turn based off of the mocha-hack
found here:
https://gregrperkins/grunt-mocha-hack
*/

var domain = require('domain');
var path = require('path');
var Mocha = require('mocha');

function MochaWrapper(params) {
  var paths = params.files.map(function(file) {
    return path.resolve(file);
  });

  var mocha = new Mocha(params.options);

  paths.forEach(mocha.addFile.bind(mocha));
  if (mocha.files.length)
    mocha.loadFiles();

  this.run = function(gruntDone) {
    //setting up mocha suite
    console.log("starting the fire");
    var suite = mocha.suite;
    console.log("1");
    var options = mocha.options;
    console.log("2");
    var runner = Mocha.Runner(suite); 
    console.log("3");
    var reporter = new mocha._reporter(runner);
    console.log("4");

    runner.ignoreLeaks = options.ignoreLeaks;
    runner.asyncOnly = options.asyncOnly;
    if (options.grep) 
      runner.grep(options.grep, options.invert);
    if (options.globals)
      runner.globals(options.globals);
    if (options.growl)
      mocha._growl(runner, reporter);

    var uncaughtExceptionHandlers = process.listeners('uncaughtException');
    process.removeAllListeners('uncaughtException');
    var unmanageExceptions = function() {
      uncaughtExceptionHandlers.forEach(
          process.on.bind(process, 'uncaughtException'));
    };

    var domain = domain.create();
    domain.on('error', runner.uncaught.bind(runner));

    var mochaDone = function(errCount) {
      var withoutErrors = (errCount === 0);
      unmanageExceptions(); 

      gruntDone(withoutErrors);
    };

    domain.run(function() {
      runner.run(mochaDone);
    });
  };
}

module.exports = MochaWrapper;
