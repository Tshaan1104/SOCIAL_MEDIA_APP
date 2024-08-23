import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import dotenv from 'dotenv';

const generateToken=(id)=>{
  const jwtSecret=process.env.JWT_SECRET;
  return jwt.sign({id},jwtSecret,{
    expiresIn:'30d',
  });
}

export const register= async(req, res) =>{
  try{
    const {username,password,email,profileImg} = req.body;
    const salt= await bcrypt.genSalt();
    const passwordHash= await bcrypt.hash(password,salt);
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debugging line to check if secret is loaded


    const newUser=new User({
      username,
      password:passwordHash,
      email,
      profileImg
    });


    const user = await newUser.save();
    const token=generateToken(user._id);

    const userdata={_id:user._id,username:user.username,email:user.email,profileImg:user.profileImg,about:user.about,posts:user.posts,followers:user.followers,following:user.following};

    res.status(200).json({token,user:userdata});
  }
  catch (err) {
    res.status(500).json({error:err.message});
  }

};

export const login = async(req, res) => {
  try{
    const {email,password} = req.body;
    const user =await User.findOne({email:email});
    if (!user) return res.status(400).json({msg: 'User not found'});

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({msg: 'Invalid Credentials'});

    const token=generateToken(user._id);
    delete user.password;
    const userdata= {_id:user._id, username:user.username, email:user.email, profileImg:user.profileImg, about:user.about, posts:user.posts, followers:user.followers, following:user.following};
    res.status(200).json({token,user:userdata});

    console.log(token,userdata);

  }
  catch (err) {
    res.status(500).json({error:err.message});
  }
};