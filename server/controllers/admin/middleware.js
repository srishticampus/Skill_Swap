const adminCheck = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    return res.status(401).json({ msg: "Not authorized" });
  }
};

export { adminCheck };