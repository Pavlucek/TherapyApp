const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({message: 'No token provided'});
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({message: 'Failed to authenticate token'});
      }
      if (roles.length && !roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({message: 'You do not have the necessary permissions'});
      }
      req.user = decoded;
      next();
    });
  };
};

module.exports = authMiddleware;
