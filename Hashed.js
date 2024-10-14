const bcrypt = require('bcryptjs'); // Use 'require' instead of 'import'

// The plain text password you want to hash
const plainPassword = 'Fatexone'; // Replace with the password you want to hash

// Generate a salt and hash the password
bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;

    bcrypt.hash(plainPassword, salt, (err, hash) => {
        if (err) throw err;
        console.log('Hashed password:', hash);
    });
});
