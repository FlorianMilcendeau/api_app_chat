const verifyUser = (req, res, next) => {
  const { id } = req.params;

  if (req.user.sub === parseInt(id, 10)) {
    return next();
  }

  return res.status(401).send('unAuthorized');
};

module.exports = verifyUser;
