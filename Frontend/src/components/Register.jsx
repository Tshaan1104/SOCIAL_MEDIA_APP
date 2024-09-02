
import React, { useContext } from 'react'
import '../styles/login.css'
import { AuthenticationContext } from '../context/AuthenticationContextProvider'

const Register = ({setIsLoginBox}) => {

  const {setUsername, setEmail, setPassword, register} = useContext(AuthenticationContext);

  const handleRegister = async (e) =>{
    e.preventDefault();

    await register()
  }

  return (
    <form className="authForm">
        <h2>Register</h2>
        <div className="form-floating mb-3 authFormInputs">
            <input type="text" className="form-control" id="floatingInput" placeholder="username" onChange={(e)=> setUsername(e.target.value)} />
            <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating mb-3 authFormInputs">
            <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" onChange={(e)=> setEmail(e.target.value)} />
            <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3 authFormInputs">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} /> 
            <label htmlFor="floatingPassword">Password</label>
        </div>
        <button className="btn btn-primary" onClick={handleRegister}>
        <span className="btn-anim1"></span>
    <span className="btn-anim2"></span>
    <span className="btn-anim3"></span>
    <span className="btn-anim4"></span>Sign up</button>

        <p>Already registered? <span onClick={()=> setIsLoginBox(true)}>Login</span></p>
    </form>
  )
}

export default Register
