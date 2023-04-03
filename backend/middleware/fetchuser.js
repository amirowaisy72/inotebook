var jwt = require('jsonwebtoken');


const JWT_SECRET = 'Amirisagoodboy';

const fetchuser = (req, res, next)=>{
    //Get the user from JWT Token and add it to the req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"});
    }else{
        try{
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data.user;
            next();
        }catch (err){
            res.status(401).send({error:"Please authenticate using a valid token"});
        }
    }
}

module.exports = fetchuser;