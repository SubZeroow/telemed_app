exports.isAuthenticated = (req, res, next) => {
    if (!req.session.patientId) {
      return res.status(401).send('Unauthorized');
    }
    next();
  };  