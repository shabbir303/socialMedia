import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*Register User */
export const register = async (req, res) => {
  try {
    const {
        firstName,
        lastName,
        email,
        password,
        friends,
        location,
        occouption,
      } = req.body
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);//password will be safe and don't watch
    //   for berification
    const newUser = new User({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        friends,
        location,
        occouption,
        viewedProfile:Math.floor(Math.random()*10000),
        impressions:Math.floor(Math.random()*10000)
    })
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).json({error: err.message}) //from mongodb database
  }
};

// Logging in
export const login = async(req, res)=>{
  try{
    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if(!user) return res.status(400).json({msg:"User does not exist"})

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg:"Invalid credentials"});

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({token, user});
  }
  catch(err){
    res.status(500).json({error: err.message});
  }
}