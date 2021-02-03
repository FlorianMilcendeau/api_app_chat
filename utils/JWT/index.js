const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

/** Read private key */
const pathToPrivKey = path.join(__dirname, '../../', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf-8');

/** Generate Json Web Token
 *
 * @param {object} user
 * @returns {{token: string, expiresIn: number}} Json Web Token and his expiration.
 */
const generateToken = (user) => {
  const { id, name, email, is_admin, roles } = user;

  // Init payload
  const payload = {
    sub: id,
    name,
    email,
    is_admin,
    roles,
    iat: Date.now(),
  };

  // expires in 2 weeks.
  const expiresIn = Date.now() + 1000 * (60 * 60) * 24 * 7;

  // token generated and singed.
  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: 'RS256',
  });

  return {
    expiresIn,
    token: `Bearer ${signedToken}`,
  };
};

/** Extraction of the Json Web Token
 *
 * @param {string} token
 * @returns {(false|string)} False if not a string, otherwise the token.
 */
const extractBearerToken = (token) => {
  if (typeof token !== 'string') {
    return false;
  }

  // Extract the "bearer" from the token..
  const matches = token.match(/(Bearer)\s+(\S+)/i);

  return matches && matches[2];
};

module.exports.generateToken = generateToken;
module.exports.extractBearerToken = extractBearerToken;
