const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Harsh Joshi',
    email: 'harshjoshi30112007@gmail.com',
    password: '123456789', // Will be hashed by userSchema pre-save hook
    isAdmin: true,
  },
];

module.exports = users;
