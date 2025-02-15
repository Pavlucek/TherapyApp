module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'therapy-app.sqlite',
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    secret: process.env.JWT_SECRET || 'your_jwt_secret',
  },
  production: {
    dialect: 'sqlite',
    storage: 'therapy-app.sqlite',
    secret: process.env.JWT_SECRET, // ensure this is defined in production
  },
};
