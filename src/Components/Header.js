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
    backgroundColor: "antiquewhite",
    border: "1px solid brown",
  },
};

const Header = () => {
  const location = useLocation();
  const [createAccountModalIsOpen, setCreateAccount] = useState(false);
  const [loginModalIsOpen, setloginModal] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(undefined);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  });
  // const [username, setusername] = useState(undefined);
  // const [email, setEmail] = useState(undefined);
  const [imageUrl, setimageUrl] = useState(undefined);
  // const [password, setPassword] = useState(undefined);
  // const [confirmPassword, setConfirmPass] = useState(undefined);
  const [signupError, setsignUpError] = useState('');
  const [ loading, setLoading] = useState(false)



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

  const CreateAccount = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    console.log('this is by name :', name)
    console.log('this is bby value :', value)
    // setusername({[name]:value})

    console.log("Create Account model Clicked ...");

    setCreateAccount(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log('handle change is : ', formData)
  };
  const handleLogin = () => {
    console.log("login model Clicked ...");
    setloginModal(true);
  };
  const handleLogout = () => {
    setLoggedInUser(undefined);
    setisLoggedIn(false);
  };

  // const loginInput = (event) => {
  //   console.log(event.target.value);
  // };

  const closeModal = () => {
    setloginModal(false);
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  // const responseFacebook = (response) => {
  //   console.log(response);
  // };

  const handleSignupForm = (event) => {
    // debugger
    event.preventDefault();
    // You can access form data in formData state here
    let condition = true;
    if(formData.password !== formData.confirmpassword){
      condition = false;
      // setFormData.password('')
      // setFormData.confirmpassword('')
      setsignUpError('Password doesn"t match!')
    }
    // var lowerCaseLetters = /[a-z]/g;
    //     var numbers = /[0-9]/g;
    //     if (!numbers.test(password) || !lowerCaseLetters.test(password)) {
    //         condition = false;
    //         this.setState({ signupError: "Password should contains letters and numbers" });
    //     }
        if (condition) {
            signupFormApiCall();
        }
    console.log(formData);
    // Perform your signup logic here
  };


  const signupFormApiCall = async()=>{
    // debugger
    setLoading(true);
    var inputObj = {
      fullname: formData.username,
      email: formData.email,
      password: formData.password

    }
    console.log('input obj is :',inputObj)
    try {
      // const result = await axios.post(`http://localhost:5000/signinup/${inputObj}`);
      const result = await axios ({
        method: 'POST',
        url: 'http://localhost:5000/signinup/user_data',
        headers: {'Content-Type': 'application/json'},
        data: formData

      })
  
      if (result.data === false) {
        setsignUpError("You are already logged in! Please Sign in!");
        setLoading(false);
      } else {
        localStorage.setItem('loginData', JSON.stringify(result.data));
        window.location.reload();
      }
    } catch (error) {
      // Handle the error here
      console.error('Error:', error);
      setLoading(false);
    }
  }

  const loginFormApiCall= async(event)=>{
    event.preventDefault();
    setLoading(true)
    const inputObj = {
      email: formData.email,
      password: formData.password
    }

    const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/login/${inputObj}`)
    if(result.data.length > 0 ){
      setFormData.username(result.data[0].fullname)
      localStorage.setItem('loginData', JSON.stringify(this.state));
            window.location.reload();
    } else {
      setsignUpError("Please provide a valid username and password.")
      setLoading(false)
    }
  }

  return (
    <>
      <header>
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
              />
            </div>
            {!isLoggedIn ? (
              <div className="nav-btn">
                {/* <button className="btn1" onClick={handleLogin}> */}
                <button className="btn1">

                  Login
                </button>
                {/* <button className="btn2" onClick={CreateAccount}> */}
                <button className="btn2" >

                  Create an account
                </button>
              </div>
            ) : (
              <div className="nav-btn">
                <button className="user">
                  <img src={loggedInUser.picture} alt="user-pic" />{" "}
                  {loggedInUser.given_name}
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
        <div className="login-modal">
          <div>
            <h2>Login</h2>
            <label>Email: </label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="email"
            />
            <br />
            <label>Password: </label>
            <input
              type="text"
              name="password"
              placeholder="Password"
              className="pass"
            />
          </div>
          <button className="login-btn">Login</button>
          <button onClick={closeModal} className="cancel-btn">
            Cancel
          </button>

          <div className="GoogleLogin">
            <GoogleOAuthProvider clientId="520599718297-1vga48mfuttjatk6np2a3fsh2h5rk3oc.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={(credentialresponse) => {
                  var decoded = jwt_decode(credentialresponse.credential);

                  console.log("Credential response is : ", decoded);
                  setLoggedInUser(decoded);
                  setisLoggedIn(true);
                  setloginModal(false);
                  // console.log(responseGoogle);
                }}
                onError={() => {
                  console.log("Login Failed ", errorMessage);
                }}
              />
            </GoogleOAuthProvider>
            {console.log("loggedin User is : ", loggedInUser)}
          </div>

          <div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={createAccountModalIsOpen} style={customStyles}>
        <div
          style={{ float: "right", display: "block", cursor: "pointer" }}
          onClick={() => {
            setloginModal(false);
          }}
        >
          {" "}
          <i class="fa-solid fa-xmark"></i>{" "}
        </div>

        <div className="login-modal">
          <div>
          <div className="signin-with" style={{ justifyContent: 'normal' }}>Sign Up</div>
            {/* <form onsubmit={handleSignupForm}>
            <label>Name: </label>
            <input
              type="text"
              name="username"
              placeholder="Name"
              className="email"
              onChange={CreateAccount}
              required
            />
            <br />
            <label>Email: </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="email"
              onChange={CreateAccount}
              required
            />
            <br />
            <label>Password: </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="pass"
              onChange={CreateAccount}
              minlength="8"
              required
            />
            <br />
            <label>Confirm Password: </label>
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm Password"
              className="pass"
              onChange={CreateAccount}
              minlength="8"
              required
            />
            </form> */}

<form onSubmit={handleSignupForm}>
        <label>Name: </label>
        <input
          type="text"
          name="username"
          placeholder="Name"
          className="email"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <br />
        <label>Email: </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="email"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <br />
        <label>Password: </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="pass"
          onChange={handleChange}
          value={formData.password}
          minLength="8"
          required
        />
        <br />
        <label>Confirm Password: </label>
        <input
          type="password"
          name="confirmpassword"
          placeholder="Confirm Password"
          className="pass"
          onChange={handleChange}
          value={formData.confirmpassword}
          minLength="8"
          required
        />
        <br />
        <button type="submit">Sign Up</button>
      </form>
          </div>
          <button className="login-btn">Create</button>
          <button onClick={closeModal} className="cancel-btn">
            Cancel
          </button>

          <div className="GoogleLogin">
            <GoogleOAuthProvider clientId="520599718297-1vga48mfuttjatk6np2a3fsh2h5rk3oc.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={(credentialresponse) => {
                  var decoded = jwt_decode(credentialresponse.credential);

                  console.log("Credential response is : ", decoded);
                  if (decoded.email_verified == true) {
                    console.log("Email is verified");
                  } else {
                    console.log("Email is not verified");
                  }
                  console.log(decoded.name, decoded.email, decoded.picture);
                  setFormData.username(decoded.name);
                  setimageUrl(decoded.picture);
                  setFormData.email(decoded.email);
                  setLoggedInUser(decoded);
                  setisLoggedIn(true);
                  console.log("loggedin User is : ", loggedInUser)
                  setCreateAccount(false);
                  // console.log(responseGoogle);
                }}
                onError={() => {
                  console.log("Login Failed ", errorMessage);
                }}
              />
            </GoogleOAuthProvider>
          </div>

          <div>
          </div>
        </div>
      </Modal>

      
    </>
  );
};

export default Header;
