const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('No token found');
        return res.sendStatus(401); // No token found
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Invalid token', err);
            return res.sendStatus(403); // Invalid token
        }
        console.log('Token is verified, user:', user);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
