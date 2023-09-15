import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate }  from 'react-router-dom'
import "../Components/Styles/home.css";
import Header from "./Header";
// import { response } from "express";


const Wallpaper = () => {
  const [locations, setLocations] = useState([]);
  const [Restaurants, setRestaurants] = useState([]);
  const [inputId, setinputId] = useState('');
  const [suggestions, setsuggestions] = useState([])
  // const [file, setfile] = useState(null)
  let navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
    // fetchRestaurant();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await axios.get("http://localhost:5000/locations");
      console.log("API Response: ", response.data);
      setLocations(response.data);
    } catch (error) {
      console.error("Error in Fetching location: ", error);
      console.log("Error details:", error.response);
    }
  };

  // const fetchRestaurant = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/restro");
  //     console.log("API Response: ", response.data);
  //     setRestaurants(response.data);
  //   } catch (error) {
  //     console.error("Error in Fetching Restaurant: ", error);
  //     console.log("Error Details: ", error.response);
  //   }
  // };

  const getLocation = async (event) => {
    // console.log(event.target.value)
    const locationId = event.target.value;
    console.log('location id is :', locationId)
    sessionStorage.setItem('locationId', locationId)
    try {
      const response = await axios.get(`http://localhost:5000/restroByLocation/${locationId}`);
      console.log("fetched data by location id is : ", response.data.response);
      // setinputId(Array.isArray(response.data) ? response.data : []);
      // console.log("Input Id is ",inputId)
      // setRestaurants(Array.isArray(response?.data) ? response?.data?.response : []);
      setRestaurants(response.data.response)
      console.log("Restaurants fetched by locationID is ",Restaurants)
    } catch (error) {
      console.log("Error is in locaiton ID is : ", error);
      setRestaurants([]); // Reset Restaurants to an empty array in case of error
    }
  };

  console.log("Restaurants fetched by locationID is out ",Restaurants)
  const handleChange = (event) => {
   let inputText = event.target.value;
   console.log('Input text is : ', inputText);
  //  setinputId(inputText)
   const suggestions = Restaurants.filter((item)=>
    item.name.toLowerCase().includes(inputText.toLowerCase())
   )
   setinputId(inputText)
   setsuggestions(suggestions)
  };

  console.log("inputID is : ", inputId)
  console.log('Suggestions is : ', suggestions)

  const showSuggestions = () =>{
    if(suggestions.length == 0 && inputId == undefined){
      return null;
    }
    if(suggestions.length > 0 && inputId == ''){
      return null;
    } if(suggestions.length == 0 && inputId){
      return <ul>
        <li>No Search Result Found</li>
      </ul>
    }
    return(
      <ul>
        {
          suggestions.map((item, index)=>(<li key={index} onClick={()=> selectingRestaurant(item)}> <img src={item.image} alt="" className="suggestion-image"/> {`${item.name} - ${item.locality},${item.city}`}</li>))
        }
      </ul>
    )
  }

  const selectingRestaurant = (item) =>{
    console.log('selected restaurant is : ', item)
    navigate(`/details?restaurant=${item._id}`)
  }

  return (
    <div>
      <Header />
      <div className=" img">
        <img
          src="./Assets/zomato.avif"
          className="img-fluid"
          alt="img Error"
        />
      </div>

      <div className="position-absolute top-50 start-50 translate-middle">
        <img
          src="./Assets/icon.jpg"
          className="img-fluid"
          alt=""
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
            marginLeft: "50%",
          }}
        />

        <h2 style={{ color: "#fff" }} className="h2">
          Find the best restaurants, cafes & bars
        </h2>

        <div className="row input-boxes">
          <div className="col-lg-6 col-sm-12">
            <select
              name="State"
              id="select"
              className="form-select"
              aria-label="Default select example"
              onChange={(event) => getLocation(event)}
            >
              <option value="0">Select</option>
              {locations.map((location, index) => {
                return (
                  <option key={index} value={location.location_id}>
                    {" "}
                    {location.name}, {location.city}
                  </option>
                );
              })}
  
            </select>
          </div>
          <div className="col">
            <div className="input-group mb-3">
            <div style={{display: 'flex'}}>
              <span className="input-group-text" id="basic-addon1">
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ color: "#adafb3" }}
                ></i>
              </span>

              <input
  type="text"
  className="form-control"
  list="restaurants"
  placeholder="Search for restaurants"
  aria-label="Username"
  aria-describedby="basic-addon1"
  onChange={handleChange}
/>
              </div>
<div className='suggestions'>{showSuggestions()}</div>


            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Wallpaper;
