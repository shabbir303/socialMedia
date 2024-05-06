import jwt from "jsonwebtoken";

export const verifyToken = async(req, res, next)=>{
    try{
      const token = req.headers("Authorization");
      if(!token) {return res.status(403).json("Access Denied")};
      if(token.startsWith("Bearer ")){
      token = token.slice(7, token.length).trimLeft()}
      const verified = jwt.verify(verifyToken , process.env.JWT_SECRET);
      req.user = verified;
      next();
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}