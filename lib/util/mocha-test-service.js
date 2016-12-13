var fs = require('fs');
var path = require('path');
var Mocha = require('mocha'),
    Suite = Mocha.Suite,
    Runner = Mocha.Runner,
    Test = Mocha.Test;

var child_process = require('child_process');
var exec = child_process.exec;

// Instantiate a Mocha instance.
var mocha = new Mocha();

function runTests(testDir, callback) {

    exec('cd ' + testDir + '&& pwd && npm install chai && npm install dotenv && npm install supertest && npm install z-schema', function(err,stout,stderr) {
        if (err) {
            console.log('Child process exited with error code', err.code);
            return
        }
        console.log(stout);
        // Add each .js file to the mocha instance
        fs.readdirSync(testDir).filter(function (file) {
            // Only keep the .js files
            return file.substr(-3) === '.js';

        }).forEach(function (file) {
            mocha.addFile(
                path.join(testDir, file)
            );
        });

        //console.log(mocha.files);

        setTimeout(function() {
            // Run the tests.
            mocha.run(function (failures) {
                //console.log(mochaReporter.testResults);
                if (failures) {
                    callback(true, failures);
                } else {
                    callback(false, null);
                }
            });
        },3000);
    });
}


module.exports = {
    runTests: runTests
};