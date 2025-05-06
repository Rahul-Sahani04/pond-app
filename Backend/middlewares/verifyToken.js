import jwt from "jsonwebtoken";

function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"No token provided"});
    }

    token = token.split(" ")[1]; // reomve Bearer from token

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if(err){
            return res.status(401).json({message:"Unauthorized"});
        }
        console.log("Decoded token: ", decoded);
        console.log("User: ", decoded.user);
        console.log("User ID: ", decoded.user.id);
        req.user = decoded.user;
        next();
    });

}

export default verifyToken;