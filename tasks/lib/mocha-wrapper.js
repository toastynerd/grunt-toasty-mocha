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
    var suite = mocha.suite;
    var options = mocha.options;
    var runner = new Mocha.Runner(suite); 
    var reporter = new mocha._reporter(runner);

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

    var mochaDomain = domain.create();
    mochaDomain.on('error', function(err) {
      console.log('HOLY CRAP AN ERROR!');
      runner.uncaught.bind(runner);
    });

    var mochaDone = function(errCount) {
      var withoutErrors = (errCount === runner.failures);
      console.dir(runner);
      gruntDone(withoutErrors);
    };

    mochaDomain.run(function() {
      console.dir(runner);
      runner.run(mochaDone);
    });
  };
}

module.exports = MochaWrapper;
