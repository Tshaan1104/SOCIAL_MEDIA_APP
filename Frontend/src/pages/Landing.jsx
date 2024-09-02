import React, { useState } from 'react';
import '../styles/landingpage.css';

import socialeXLogo from '../images/SANGAM. (2).png';
import About1 from '../images/bike sample.jpeg';
import About2 from '../images/car sample pictures.jpeg';

import Login from '../components/Login';
import Register from '../components/Register';

const LandingPage = () => {

    const [isLoginBox, setIsLoginBox] = useState(true);


  return (
    // <div className='bcky'>
    <div className='landingPage'>
        
        <div className="landing-header">
            <span className="landing-header-logo"><img src={socialeXLogo} alt="" /></span>
            <ul>
                <li className='header-li'><a href="#home">Home</a></li>
                <li className='header-li'><a href="#about">About</a> </li>
                <li className='header-li'><a href="#home">Join now</a></li>
            </ul>
        </div>



        <div className="landing-body">

            <div className="landing-hero" id='home'>
                <div className="landing-hero-content">
                <h1 style={{ fontFamily: "'Lobster', cursive" }}>SANGAM</h1>
                <p>
                    Step into SANGAM, the playground for the wildly imaginative, where vibrant communities thrive and eccentricities are celebrated  </p>

                    <div className="authentication-form">

                        { isLoginBox ?

                            <Login setIsLoginBox={setIsLoginBox} />
                            :
                            <Register setIsLoginBox={setIsLoginBox} />
                        }

                    </div>

                </div>


                <div className="landing-hero-image">
                    
                        <div id='landing-image-sidebar-left'></div>
                        <div className="back"></div>
                        <div id='landing-image-sidebar-right'></div>
                   
                </div>
            </div>

            <div className="landing-about" id='about'>

                <div className="about-1">
                    <img src={About1} className='about-1-img' alt="" />
                    <div className="about-1-content">

                        <h3>Stay Connected</h3>
                        <p>SANGAM makes it easy to stay connected with your old friends, no matter where they are in the world. Join the platform, follow their profiles, and stay updated on their latest activities. Engage with their posts, share memories, and reminisce together.</p>
                        <a href='#home'>Join now!!</a>

                    </div>
                </div>
                <div className="about-2">
                    <div className="about-2-content">
                        <h3>Amplify Your Voice</h3>
                        <p>SANGAM gives you the power to amplify your voice and share your unique perspective with a global audience. Whether you're an artist, a writer, a musician, or a content creator in any other field, SANGAM provides you with the stage to showcase your talent and gain recognition.</p>
                        <a href='#home'>Join now!!</a>
                    </div>
                    <img src={About2} className='about-2-img' alt="" />
                </div>

            </div>

            <div className="footer">
                <p>All rights reserved - &#169;     .com</p>
            </div>


        </div>

    </div>
  )
}

export default LandingPage