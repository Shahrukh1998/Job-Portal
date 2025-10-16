import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return next();
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    next();
  }
};

export const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
};