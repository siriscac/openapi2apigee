var fs = require('fs');
var path = require('path');

function generateCIProject(options, callback) {
    var destination = options.destination || '';

    if (destination.substr(-1) !== '/') {
        destination = destination.substr(0, destination.length - 1)
    } else {
        destination = destination + '/';
    }

    var rootDir = destination;

    var travisTemplateContent = fs.readFileSync(path.join(__dirname, '../../ci_templates') + '/travis_template.yml', 'utf8');
    var gulpTemplateContent = fs.readFileSync(path.join(__dirname, '../../ci_templates') + '/gulpfile_template.js_t', 'utf8');
    var packageTemplateContent = fs.readFileSync(path.join(__dirname, '../../ci_templates') + '/ci_project_package.json', 'utf8');

    fs.writeFile(rootDir + '.travis.yml', travisTemplateContent, function (err) {
        if (err) {
            return callback(err);
        } else {
            fs.writeFile(rootDir + 'gulpfile.js', gulpTemplateContent, function (err) {
                if (err) {
                    return callback(err);
                } else {
                    fs.writeFile(rootDir + 'package.json', packageTemplateContent, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    generateCIProject: generateCIProject
};