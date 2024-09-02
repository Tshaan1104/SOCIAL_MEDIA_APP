import React, { createContext, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthenticationContext = createContext();

const AuthenticationContextProvider = ({children}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [password, setPassword] = useState('');
  // const [profileImg, setProfileImg] = useState('');
  const profileImg = '../images/craetepost.jpeg';


  const inputs = {username: username, email: email, password: password, profileImg: profileImg};


  const navigate = useNavigate();

  const login = async () =>{

    try{

      const loginInputs = {email: email, password: password}
        await axios.post('http://localhost:6001/api/login', loginInputs)
        .then( async (res)=>{
            console.log("holaads",res);
            localStorage.setItem('userToken', res.data.token);
            localStorage.setItem('userId', res.data.user._id);
            localStorage.setItem('username', res.data.user.username);
            localStorage.setItem('email', res.data.user.email);
            localStorage.setItem('profileImg', res.data.user.profileImg);
            localStorage.setItem('posts', res.data.user.posts);
            localStorage.setItem('followers', res.data.user.followers);
            localStorage.setItem('following', res.data.user.following);
            navigate('/');
        }).catch((err) =>{
            console.log(err);
        });

    }catch(err){
        console.log(err);
    }
  }

  const register = async () =>{

    try{
        await axios.post('http://localhost:6001/api/register', inputs)
        .then( async (res)=>{
          localStorage.setItem('userToken', res.data.token);
          localStorage.setItem('userId', res.data.user._id);
          localStorage.setItem('username', res.data.user.username);
          localStorage.setItem('email', res.data.user.email);
          localStorage.setItem('profileImg', res.data.user.profileImg);
          localStorage.setItem('posts', res.data.user.posts);
          localStorage.setItem('followers', res.data.user.followers);
          localStorage.setItem('following', res.data.user.following);  
          navigate('/');
        }).catch((err) =>{
            console.log(err);
        });

    }catch(err){
        console.log(err);
    }
  }



  const logout = async () =>{
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }
    
    navigate('/landing');
  }



  return (
    <AuthenticationContext.Provider value={{login, register, logout, username, setUsername, email, setEmail, password, setPassword }} >{children}</AuthenticationContext.Provider>
  )
}

export default AuthenticationContextProvider