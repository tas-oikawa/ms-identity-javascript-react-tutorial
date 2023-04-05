const  jwt = require("jsonwebtoken");
const  passportConfig = require('../authConfig');
const jwksClient = require('jwks-rsa');
const { TokenExpiredError } = require('jsonwebtoken')

exports.validateIdToken = async (idToken, callback) => {

  //https://login.microsoftonline.com/e8322962-e54e-4349-8297-0dada2f90df5/v2.0/.well-known/openid-configuration
  const metadataUrl = `https://${passportConfig.metadata.b2cDomain}/${passportConfig.credentials.tenantName}/${passportConfig.policies.policyName}/${passportConfig.metadata.version}/${passportConfig.metadata.discovery}`;
  const response = await (await fetch(metadataUrl)).json();

  const jwksUri = response.jwks_uri;
  const client = jwksClient({
    jwksUri: jwksUri
  });
  const getKey = (header, callback) => {
    client.getSigningKey(header.kid, function(err, key) {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  };
  jwt.verify(idToken, getKey, (err, decoded) => {
    if (err) {
      return callback(401);
    }
    return callback(200);
  });
};
