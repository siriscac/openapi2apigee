var stt = require('swagger-test-templates');
var fs = require('fs');
var mkdirp = require('mkdirp');


var config = {
    assertionFormat: 'should',
    testModule: 'supertest',
    pathName: []
};

function generateTests(options, callback) {
    fs.readFile(options.source, 'utf8', function read(err, data) {
        if (err) {
            callback(err);
        }
        var swagger = JSON.parse(data);
        var tests = stt.testGen(swagger, config);


        //Create dir if it doesn't exist
        var destination = options.destination || '';

        if (destination.substr(-1) !== '/') {
            destination = destination.substr(0, destination.length - 1)
        } else {
            destination = destination + '/';
        }

        var rootDir = destination;
        mkdirp(rootDir, function (err) {
            if (err) return callback(err);

            //Generate test files from the spec
            tests.forEach(function (test, index) {
                fs.writeFile(rootDir + test.name, test.test, function (err) {
                    if (err) {
                        return callback(err);
                    }
                });
                if (index == tests.length - 1) {
                    callback(null);
                }
            });
        });
    });
}

module.exports = {
    generateTests: generateTests
};