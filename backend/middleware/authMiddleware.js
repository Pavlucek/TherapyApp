const jwt = require('jsonwebtoken');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const secret = config[env].secret; // Używamy sekretu dla bieżącego środowiska

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('[authMiddleware] Token from header:', token);

    if (!token) {
      console.log('[authMiddleware] Brak tokenu');
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.log('[authMiddleware] Błąd weryfikacji tokenu:', err.message);
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }

      console.log('[authMiddleware] Token zweryfikowany, decoded:', decoded);

      if (roles.length && !roles.includes(decoded.role)) {
        console.log(
          `[authMiddleware] Użytkownik z rolą ${decoded.role} nie ma wymaganych uprawnień. Wymagane role: ${roles.join(
            ', '
          )}`
        );
        return res.status(403).json({ message: 'You do not have the necessary permissions' });
      }

      req.user = decoded;
      console.log('[authMiddleware] Użytkownik ustawiony w req.user:', req.user);
      next();
    });
  };
};

module.exports = authMiddleware;
