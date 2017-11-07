const fs = require('fs');

if (fs.existsSync('./public')) {
    process.env.NODE_ENV = 'production';
    process.env.databaseUri = 'mongodb://user:user@ds149855.mlab.com:49855/mean-poc'; // Databse URI and database name
    process.env.databaseName = 'production database: mean-poc'; // Database name
} else {
    process.env.NODE_ENV = 'development';
    process.env.databaseUri = 'mongodb://localhost:27017/mean-poc'; // Databse URI and database name
    process.env.databaseName = 'development database: mean-poc'; // Database name
}