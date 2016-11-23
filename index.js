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

initHash("A");
request({
    url: somePackage,
    agentOptions: {
      keepAlive: false,
    },
  })
  .on('error', function (error) { processError("A", error); })
  .on('data', function(data) {
    hash.A.update(data);
  })
  .on('response', function (response) { processResponse("A", response); })
  .pipe(fs.createWriteStream('testA.tgz'))
  .on('finish', function () {
    console.log("HashA is", hash.A.digest("hex"))
  })
;

initHash("B");
request(
  {
    url: somePackage,
    agentOptions: {
      keepAlive: false,
    },
  },
  function (error, response, body) {
    if (error) {
      processError("B", error);
    } else {
      processResponse("B", response);
      hash.B.update(body);
      console.log("HashB is", hash.B.digest("hex"))
    }
  })
  .pipe(fs.createWriteStream("testB.tgz"));