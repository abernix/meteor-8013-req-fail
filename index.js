var fs = require("fs");
var request = require('request');
// request.debug = true;
// require('request-debug')(request);

var crypto = require('crypto');

var hash = {};

var somePackage = "https://d3fm2vapipm3k9.cloudfront.net/builds/EXSxwGqYjjJKh3WMJ/1477416387312/oW5pojeAuq/fastclick-1.0.13-os+web.browser+web.cordova.tgz";

function initHash(test) {
  return hash[test] || (hash[test] = crypto.createHash('md5'));
}

function processError(test, error) {
  console.error("ERROR", error);
}

function processResponse(test, response) {
  delete response.body;
  console.log(" %s Response callback", test);
}

function hashUpdate(test, data) {
  return initHash(test).update(data);
}

function finish(test) {
  console.log("Hash%s is", test, hash[test].digest("hex"));
}

var http = require('http');
var https = require('https');

var agentHttp = new http.Agent({ keepAlive: true });
var agentHttps = new https.Agent({ keepAlive: true });

var requestOptions = {
  url: somePackage,
  agent: agentHttps,
  encoding: null,
}

function doTest(test, f) {
  var outputFile = "test" + test + ".tgz";
  f(test, outputFile);
}

doTest("A", function (test, outputFile) {
  initHash(test);
  request(requestOptions)
    .on('error', function (error) { processError(test, error); })
    .on('data', function(data) { hashUpdate(test, data); })
    .on('response', function (response) { processResponse(test, response); })
    .pipe(fs.createWriteStream(outputFile))
    .on('finish', function () { finish(test); })
  ;
});

doTest("B", function (test, outputFile) {
  initHash(test);
  request(
    requestOptions,
    function (error, response, body) {
      if (error) {
        processError(test, error);
      } else {
        processResponse(test, response);
        fs.writeFile(outputFile, body);
        hashUpdate(test, body);
        finish(test);
      }
    }
  );
});