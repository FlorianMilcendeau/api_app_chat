const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const { extractBearerToken } = require('../utils/JWT');

const pathToPubKey = path.join(__dirname, '../', 'id_rsa_pub.pem');
const PUBLIC_KEY = fs.readFileSync(pathToPubKey, 'utf-8');

const checkToken = (req, res, next) => {
  // Get token.
  const token =
    req.headers.authorization && extractBearerToken(req.headers.authorization);

  // If the token does not exist.
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Error. Need a token',
    });
  }

  // Verify Json Web Token.
  return jwt.verify(
    token,
    PUBLIC_KEY,
    {
      clockTimestamp: Date.now(),
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: err.message,
        });
      }
      const { iat, exp, ...user } = decoded;

      // If the token is valid
      req.user = user;
      return next();
    }
  );
};

module.exports = checkToken;
