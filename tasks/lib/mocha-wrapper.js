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

//    var uncaughtexceptionhandlers = process.listeners('uncaughtexception');
//    process.removealllisteners('uncaughtexception');
//    var unmanageexceptions = function() {
//      uncaughtExceptionHandlers.forEach(
//          process.on.bind(process, 'uncaughtException'));
//    };

    var mochaDomain = domain.create();
    mochaDomain.on('error', function(err) {
      console.log('HOLY CRAP IT\'S AN ERROR');
      console.dir(err);
      throw new Error("GAHHHHHHHH");
    });

    var mochaDone = function(errCount) {
      var withoutErrors = (errCount === 0);
  
      console.log('number of errors: ' + errCount);

      gruntDone(withoutErrors);
    };

    mochaDomain.run(function() {
      runner.run(mochaDone);
    });
  };
}

module.exports = MochaWrapper;
