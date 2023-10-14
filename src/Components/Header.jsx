import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
// import GoogleLogin from "react-google-login";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import "../Components/Styles/Filter.css";
import "../Components/Styles/user-login.css";
import axios from "axios";
// import "../Components/Styles/home.css";
// import  { Link } from 'react-router-dom';

const API = process.env.REACT_APP_BASE_URL;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Adjust the width as needed for responsiveness
    maxWidth: "400px", // Set a maximum width if desired
    padding: "20px", // Add padding to the content
    backgroundColor: "#f5f5f5",
    border: "1px solid #36454f",
    overflow: "hidden",
  },
};

const Header = () => {
  const location = useLocation();
  const [createAccountModalIsOpen, setCreateAccount] = useState(false);
  const [loginModalIsOpen, setloginModal] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({
    given_name: "",
    picture: "",
    fullname: "",
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [googleData, setGoogleData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // const [username, setusername] = useState(undefined);
  // const [email, setEmail] = useState(undefined);
  const [imageUrl, setimageUrl] = useState(undefined);
  // const [password, setPassword] = useState(undefined);
  // const [confirmPassword, setConfirmPass] = useState(undefined);
  const [signupError, setsignUpError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Modal.setAppElement("body"); // Set the app element to the body
  }, []);
  useEffect(() => {
    // Check if user info is stored in local storage and set it if available
    const localName = localStorage.getItem("Username");
    const localPicture = localStorage.getItem("imageUrl");
    const localFullName = localStorage.getItem("fullname");
    if (localName && localPicture) {
      setLoggedInUser({
        given_name: localName,
        picture: localPicture,
      });
      setisLoggedIn(true);
    } else if (localFullName) {
      setLoggedInUser({
        given_name: localFullName,
        picture: "",
      });
    }
  }, []);

  const navigate = useNavigate();
  const handleNavigation = (data) => {
    // Example navigation using useNavigate
    navigate("/");

    // Log some data to the console
    //console.log("Navigation executed!", data);
  };

  //----------------- Login Functionality --------------

  const handleLogin = () => {
    //console.log("login model Clicked ...");
    setloginModal(true);
  };
  const handleLogout = () => {
    setLoggedInUser({
      given_name: "",
      picture: "",
    });
    localStorage.removeItem("Username");
    localStorage.removeItem("imageUrl");
    localStorage.removeItem("fullname");
    setisLoggedIn(false);
    window.location.reload();
  };

  // const loginInput = (event) => {
  //   //console.log(event.target.value);
  // };

  const closeModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    });
    setCreateAccount(false);
  };

  const errorMessage = (error) => {
    //console.log(error);
  };

  // ------------------ Create an Account Functionality ---------------

  const CreateAccount = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    //console.log("this is by name :", name);
    //console.log("this is bby value :", value);
    //console.log("Create Account model Clicked ...");

    setCreateAccount(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //console.log("handle change is : ", formData);

  const handleSignupForm = (event) => {
    // debugger
    event.preventDefault();
    // You can access form data in formData state here
    let condition = true;

    if (formData.password !== formData.confirmpassword) {
      condition = false;
      setsignUpError('Password doesn"t match!');
      alert('Password doesn"t match!');
    }

    // var lowerCaseLetters = /[a-z]/g;
    //     var numbers = /[0-9]/g;
    //     if (!numbers.test(password) || !lowerCaseLetters.test(password)) {
    //         condition = false;
    //         this.setState({ signupError: "Password should contains letters and numbers" });
    //     }

    //console.log("Form data before condition: ", formData);
    if (condition) {
      signupFormApiCall();
    }
    //console.log("Form data after click button : ", formData);
    // Perform your signup logic here
  };

  const signupFormApiCall = async () => {
    setLoading(true);
    debugger;

    var inputObj = {
      fullname: formData.username,
      email: formData.email,
      password: formData.password,
    };
    //console.log("input obj is :", inputObj);

    var googleObj = {
      fullname: googleData.username,
      email: googleData.email,
      password: googleData.password,
    };
    //console.log("Google Obj is : ", googleObj);
    try {
      const dataToSend =
        Object.keys(inputObj).length > 0 ? inputObj : googleObj;

      // const result = await axios.post(`http://localhost:5000/signinup/${inputObj}`);
      const result = await axios({
        method: "POST",
        url: `${API}/signup`,
        headers: { "Content-Type": "application/json" },
        data: dataToSend,
      });
      debugger;

      if (result.data === false) {
        setsignUpError(
          "This email is already in use! Please Sign in with different!"
        );
        setLoading(false);
        alert(
          "This email is already in use! Please Sign in with different one!"
        );
        // window.location.reload();
      } else {
        // localStorage.setItem("loginData", JSON.stringify(result.data));
        // let loginUser = JSON.parse(localStorage.getItem("loginData"));
        // //console.log("Login data in localStorage is : ", loginUser);
        // //console.log("user name is : ", loginUser.fullname);
        // setLoggedInUser(loginUser);
        alert("Account created successfully, Please login!");
        window.location.reload();
      }
    } catch (error) {
      // Handle the error here
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // Login Api Call

  const loginFormApiCall = async (event) => {
    // debugger;
    event.preventDefault();
    setLoading(true);
    const inputObj = {
      email: formData.email,
      password: formData.password,
    };

    //console.log("Login input data is : ", inputObj);

    const result = await axios({
      method: "POST",
      url: `${API}/login`,
      headers: { "Content-Type": "application/json" },
      data: inputObj,
    });
    if (result.data.length > 0) {
      // setFormData.username(result.data[0].fullname);
      // setLoggedInUser(result.data[0].fullname);
      //console.log("loggedInUser is : ", loggedInUser);
      localStorage.setItem("fullname", result.data[0].fullname);
      setisLoggedIn(true);
      setloginModal(false);
      setFormData({
        email: "",
        password: "",
      });
    } else {
      setsignUpError("Please provide a valid username and password.");
      alert("Please provide a valid username and password.");
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        {/* Navbar Items  */}

        <div
          id="nav-filter"
          className={`${location.pathname === "/" ? "transparent" : "red"}`}
        >
          <div className="nav-items">
            <div className="nav-icon">
              <img
                src="./Assets/icon.jpg"
                alt="Icon error"
                onClick={handleNavigation}
                style={{ cursor: "pointer" }}
              />
            </div>
            {!isLoggedIn ? (
              <div className="nav-btn">
                <button className="btn1" onClick={handleLogin}>
                  {/* <button className="btn1"> */}
                  Login
                </button>
                <button className="btn2" onClick={CreateAccount}>
                  {/* <button className="btn2" > */}
                  Create an account
                </button>
              </div>
            ) : (
              <div className="nav-btn">
                <button className="user">
                  {/* <img src={loggedInUser.picture} alt="user-pic" />{" "}
                  {loggedInUser.given_name ? loggedInUser.given_name : loggedInUser.fullname} */}

                  {/* {loggedInUser.picture && loggedInUser.given_name ? (
                    <>
                      <img src={loggedInUser.picture} alt="user-pic" />{" "}
                      {loggedInUser.given_name}
                    </>
                  )  */}
                  {loggedInUser.picture && loggedInUser.given_name ? (
                    <>
                      <img src={loggedInUser.picture} alt="user-pic" />{" "}
                      {loggedInUser.given_name}
                    </>
                  ) : (
                    <>{loggedInUser.given_name}</>
                  )}
                </button>
                {/* <button className="btn1">{loggedInUser}</button> */}
                <button className="btn2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ------------ Login Modal ------- */}

      <Modal isOpen={loginModalIsOpen} style={customStyles}>
        <div
          style={{ float: "right", display: "block", cursor: "pointer" }}
          onClick={() => {
            setloginModal(false);
          }}
        >
          {" "}
          <i class="fa-solid fa-xmark"></i>{" "}
        </div>
        {/* <div className="login-modal"> */}
        <form onSubmit={loginFormApiCall}>
          <div>
            <h2>Login</h2>
            <div className="row mb-3">
              <label for="inputEmail3" class="col-sm-2 col-form-label">
                Email:{" "}
              </label>
              <div class="col-sm-10">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control "
                  id="inputEmail3"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>
            </div>

            <div class="row mb-3">
              <label for="inputPassword3" class="col-sm-2 col-form-label">
                Password:{" "}
              </label>
              <div class="col-sm-10">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control "
                  id="inputPassword3"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ marginRight: "10px" }}
            type="submit"
          >
            Login
          </button>
          <button onClick={closeModal} className="btn btn-primary">
            Cancel
          </button>
        </form>
        <div className="GoogleLogin">
          <GoogleOAuthProvider clientId="520599718297-1vga48mfuttjatk6np2a3fsh2h5rk3oc.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={(credentialresponse) => {
                var decoded = jwt_decode(credentialresponse.credential);

                //console.log("Credential response is : ", decoded);
                setLoggedInUser(decoded);
                localStorage.setItem("Username", decoded.given_name);
                localStorage.setItem("imageUrl", decoded.picture);
                setisLoggedIn(true);
                setloginModal(false);
                // //console.log(responseGoogle);
              }}
              onError={() => {
                //console.log("Login Failed ", errorMessage);
              }}
            />
          </GoogleOAuthProvider>
          {/* {//console.log("loggedin User is : ", loggedInUser)} */}
        </div>

        {/* <div></div>
        </div> */}
      </Modal>

      {/* --------------- Create an account Modal ------------- */}

      <Modal isOpen={createAccountModalIsOpen} style={customStyles} cl>
        <div
          style={{ float: "right", display: "block", cursor: "pointer" }}
          onClick={() => {
            setCreateAccount(false);
          }}
        >
          {" "}
          <i class="fa-solid fa-xmark"></i>{" "}
        </div>

        <div className="login-modal">
         
          <div className="container">
            <form onSubmit={handleSignupForm}>
              <div>
                <h2>Sign Up</h2>
                <div className="mb-3">
                  {/* <label htmlFor="username" className="form-label">Name:</label> */}
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Name"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.username}
                    required
                  />
                </div>
                <div className="mb-3">
                  {/* <label htmlFor="email" className="form-label">Email:</label> */}
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                </div>
                <div className="mb-3">
                  {/* <label htmlFor="password" className="form-label">Password:</label> */}
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.password}
                    minLength="8"
                    required
                  />
                </div>
                <div className="mb-3">
                  {/* <label htmlFor="confirmpassword" className="form-label">Confirm Password:</label> */}
                  <input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder="Confirm Password"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.confirmpassword}
                    minLength="8"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
                <button
                  onClick={closeModal}
                  className="btn btn-secondary cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* -------------- Sign Up With Google -------------- */}

          {/* <div className="GoogleLogin">
            <GoogleOAuthProvider clientId="520599718297-1vga48mfuttjatk6np2a3fsh2h5rk3oc.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={(credentialresponse) => {
                  var decoded = jwt_decode(credentialresponse.credential);

                  //console.log("Credential response is : ", decoded);
                  if (decoded.email_verified == true) {
                    //console.log("SignIn Up Email is verified");
                  } else {
                    //console.log(" SignIn Up Email is not verified");
                  }
                  //console.log(decoded.name, decoded.email, decoded.picture);

                  // Store the data in the googleData state
                  setGoogleData({
                    username: decoded.name,
                    email: decoded.email,
                    password: decoded.name,
                  });

                  //console.log("setgoogledata is : ", googleData);
                  setimageUrl(decoded.picture);
                  setLoggedInUser(decoded);
                  setisLoggedIn(true);
                  //console.log("loggedin User is : ", loggedInUser);
                  setCreateAccount(false);
                  // //console.log(responseGoogle);
                }}
                onError={() => {
                  //console.log("Login Failed ", errorMessage);
                }}
              />
            </GoogleOAuthProvider>
          </div> */}
        </div>
      </Modal>
    </>
  );
};

export default Header;
