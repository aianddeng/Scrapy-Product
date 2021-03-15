const path = require('path');
const dotenv = require('dotenv');

dotenv.config(
    process.env.NODE_ENV === 'development'
        ? path.join(__dirname, '.env.dev')
        : path.join(__dirname, '.env.prod')
);

module.exports = {
    host: '0.0.0.0',
    port: 80
}