import jwt from "jsonwebtoken";

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
      if (err) {
        res.locals.isLoggedIn = false;
      } else {
        res.locals.isLoggedIn = true;
      }
    });
  }
  next();
};

export default isLoggedIn;
