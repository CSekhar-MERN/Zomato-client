import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
// import GoogleLogin from "react-google-login";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import "../Components/Styles/Filter.css";
// import "../Components/Styles/home.css";
// import  { Link } from 'react-router-dom';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "30vh",
    width: "30vw",
  },
};

const Header = () => {
  const location = useLocation();
  const [loginModalIsOpen, setloginModal] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(undefined);

  useEffect(() => {
    Modal.setAppElement("body"); // Set the app element to the body
  }, []);

  const navigate = useNavigate();
  const handleNavigation = (data) => {
    // Example navigation using useNavigate
    navigate("/");

    // Log some data to the console
    console.log("Navigation executed!", data);
  };

  const handleLogin = () => {
    console.log("Clicked ...");
    setloginModal(true);
  };

  const closeModal = () => {
    setloginModal(false);
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <>
      <header>
        <div
          id="nav-filter"
          className={`${
            location.pathname === "/" ? "transparent" : "red"
          }`}
        >
          <div className="nav-items">
            <div className="nav-icon">
              <img
                src="./Assets/icon.jpg"
                alt="Icon error"
                onClick={handleNavigation}
              />
            </div>
            {!isLoggedIn ? (
              <div className="nav-btn">
                <button className="btn1" onClick={handleLogin}>
                  Login
                </button>
                <button className="btn2">Create an account</button>
              </div>
            ) : (
              <div className="nav-btn">
                <button className="user"><img src={loggedInUser.picture} alt="user-pic" /> {loggedInUser.given_name}</button>
                {/* <button className="btn1">{loggedInUser}</button> */}
                <button className="btn2">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <Modal isOpen={loginModalIsOpen} style={customStyles}>
        <div>
          <h2>Login</h2>
          <input type="text" placeholder="Email" />
          <br />
          <input type="text" placeholder="Password" />
        </div>
        <button>Login</button>
        <button onClick={closeModal}>Cancel</button>

        <div>
          <GoogleOAuthProvider clientId="520599718297-1vga48mfuttjatk6np2a3fsh2h5rk3oc.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={(credentialresponse) => {
                var decoded = jwt_decode(credentialresponse.credential);

                console.log("Credential response is : ", decoded);
                setLoggedInUser(decoded);
                console.log('loggedin User is : ', loggedInUser)
                setisLoggedIn(true);
                setloginModal(false);
                // console.log(responseGoogle);
              }}
              onError={() => {
                console.log("Login Failed ", errorMessage);
              }}
            />
          </GoogleOAuthProvider>
        </div>
      </Modal>
    </>
  );
};

export default Header;
