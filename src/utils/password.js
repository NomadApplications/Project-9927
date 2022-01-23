const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}

async function isPassword(hashed, compareTo){
    return await bcrypt.compare(compareTo, hashed);
}

/*
(async () => {
    const pass = await hashPassword('1234');
    console.log(await isPassword(pass, '1234')) // true
})();
*/

module.exports = {
    hashPassword,
    isPassword
}