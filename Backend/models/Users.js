import mongoose from 'mongoose';

// const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username:{
    type: String,
    require:true
  },
  email:{
    type:String,
    require:true,
    unique:true
  },
  password:{
    type:String,  
    require:true
  },
  profileImg:{
    type:String
  },
  about:{
    type:String
  },
  posts:{
    type:Array
  },
  followers:{
    type:Array
  },
  following:{
    type:Array
  }
});


const User = mongoose.model('users', userSchema);

export default User;
