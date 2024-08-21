module.exports = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret',
  db: {
    dialect: 'sqlite',
    storage: 'therapy-app.sqlite',
  },
};
