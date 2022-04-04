const jwt = require('jsonwebtoken');
require('dotenv').config();

var port = process.env.PORT;
var host = process.env.HOST;


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log(req.cookies);
    if (token) {
        jwt.verify(token, process.env.secrect_key, async (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                // console.log(decodedToken);
                req.user = decodedToken.user;
                next();
            }
        });
    } else {
        res.render('login',{host,port});
    }
    // next();
};

module.exports = { checkUser };