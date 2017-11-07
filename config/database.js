const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
  // dev
  //  uri: 'mongodb://localhost:27017/mean-poc', 
  // db: 'mean-poc'
  // prod
  uri: 'mongodb://user:user@ds149855.mlab.com:49855/mean-poc',
  db: 'mean-poc',
  secret: crypto,
}
