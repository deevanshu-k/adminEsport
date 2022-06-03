const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { tour_users } = require('../models/tourDetails');
require('dotenv').config();
var port = process.env.PORT;
var host = process.env.HOST;

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


const maxAge = 60 * 10;
const createToken = (id,user) => {
  return jwt.sign({ id,user }, process.env.secrect_key, {
    expiresIn: maxAge
  });
};

module.exports.login_get = (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.secrect_key, async (err, decodedToken) => {
      if (err) {
        res.render('login', { host, port });
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.render('login', { host, port });
  }
}

module.exports.login_post = async (req, res) => {
  console.log(req.body);
  const { user, password } = req.body;


  // salt = await bcrypt.genSalt(10);
  // a = await bcrypt.hash(password,salt);
  // tour_users.create({
  //   user: user,
  //   hash: a,
  //   userid: between(125500,200000),
  // })


  try {
    u = await tour_users.findOne({
      where: { user: user },
    })
    
    if(!u) throw error = "wrong username!";

    b = await bcrypt.compare(password, u.toJSON().hash);
    // console.log(b);

    if (user === u.toJSON().user && b) {
      const token = createToken(u.toJSON().userid,u.toJSON().user);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: 125500 });
    }
    else  throw error = "wrong password!";

  } catch (error) {
    // console.log("Catch block");
    // console.log(error);

    res.status(200).json({ error: error });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
}
