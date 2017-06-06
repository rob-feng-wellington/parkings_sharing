var jwt    = require('jsonwebtoken'),
    config = require('./config');

module.exports = {
  checkToken: function(req, res, next) {
    var token = req.body.token || req.query.token;
    
    if(!token){
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }

    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        return next();
      }
    }); 
  }
}