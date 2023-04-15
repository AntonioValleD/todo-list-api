const bcrypt = require('bcrypt');

const hashPassword = (plainPassword) => {
    return bcrypt.hashSync(plainPassword, 10);
};

const comparePasswords = (plainPassword, hashedPassword, done) => {
    bcrypt.compare(plainPassword, hashedPassword, done);
};


exports.hashPassword = hashPassword;
exports.comparePasswords = comparePasswords;