var allTestFiles = []
var TEST_REGEXP = /(spec|test)\.js$/i

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
        // then do not normalize the paths
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
        allTestFiles.push(normalizedTestModule)
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/',

    paths: {
        'jquery': '/base/node_modules/jquery/dist/jquery',
        'underscore': '/base/node_modules/underscore/underscore',
        'backbone': '/base/node_modules/backbone/backbone',
        'lodash': '/base/node_modules/lodash/lodash',
        'backbone-simple-directive': '/base/backbone-simple-directive'
    },

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
