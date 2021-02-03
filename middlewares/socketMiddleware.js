const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { extractBearerToken } = require('../utils/JWT');

const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUBLIC_KEY = fs.readFileSync(pathToPubKey, 'utf8');

const authenticateJwt = (token, socket, next) => {
  const tokenExtrated = extractBearerToken(token);

  jwt.verify(
    tokenExtrated,
    PUBLIC_KEY,
    {
      clockTimestamp: Date.now(),
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) return next(new Error('Authentication error'));

      const { sub, name, email } = decoded;

      Object.assign(socket, { user: { id: sub, name, email } });

      next();
    }
  );
};

/** convert a connect middleware to a Socket.IO middleware */
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

module.exports.wrap = wrap;
module.exports.authenticateJwt = authenticateJwt;
