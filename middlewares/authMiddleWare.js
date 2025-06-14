const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        req.isLoggedIn = true;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  }
  next();
};

module.exports = { requireAuth, isLoggedIn };
