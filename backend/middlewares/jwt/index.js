const jwt = require('jsonwebtoken');

function jwtProtected(req, res, next) { 
    const authHeader = req.headers['authorization']
    // NOTE: Esta condicional es de las cosas raras que solo pasan en JS jajaja
    const token = authHeader && authHeader.startsWith("Bearer") && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(403)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(401)
        }
        req._id = user.id;
        next()
    });
}

module.exports = {
    jwtProtected,
}