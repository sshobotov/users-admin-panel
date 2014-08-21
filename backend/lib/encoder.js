var crypto = require('crypto');

exports.secureHash = function(password) {
  return encryptSha1(encryptSha1(password));
};

function encryptSha1(string) {
  var shasum = crypto.createHash('sha1');
  shasum.update(string);
  return shasum.digest('hex');
}