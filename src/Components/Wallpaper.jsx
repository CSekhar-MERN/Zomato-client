import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Components/Styles/home.css";
import Header from "./Header";
// import { response } from "express";
const API = process.env.REACT_APP_BASE_URL;

const Wallpaper = () => {
  const [locations, setLocations] = useState([]);
  const [Restaurants, setRestaurants] = useState([]);
  const [inputId, setinputId] = useState("");
  const [suggestions, setsuggestions] = useState([]);
  // const [file, setfile] = useState(null)
  let navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
    // fetchRestaurant();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await axios.get(`${API}/locations`);
      //console.log("API Response: ", response.data);
      setLocations(response.data);
    } catch (error) {
      console.error("Error in Fetching location: ", error);
      //console.log("Error details:", error.response);
    }
  };
  const getLocation = async (event) => {
    // console.log(event.target.value)
    const locationId = event.target.value;
    //console.log("location id is :", locationId);
    sessionStorage.setItem("locationId", locationId);
    try {
      const response = await axios.get(`${API}/restroByLocation/${locationId}`);
      //console.log("fetched data by location id is : ", response.data.response);
      // setinputId(Array.isArray(response.data) ? response.data : []);
      // console.log("Input Id is ",inputId)
      // setRestaurants(Array.isArray(response?.data) ? response?.data?.response : []);
      setRestaurants(response.data.response);
      //console.log("Restaurants fetched by locationID is ", Restaurants);
    } catch (error) {
      //console.log("Error is in locaiton ID is : ", error);
      setRestaurants([]); // Reset Restaurants to an empty array in case of error
    }
  };

  //console.log("Restaurants fetched by locationID is out ", Restaurants);
  const handleChange = (event) => {
    let inputText = event.target.value;
    //console.log("Input text is : ", inputText);
    //  setinputId(inputText)
    const suggestions = Restaurants.filter((item) =>
      item.name.toLowerCase().includes(inputText.toLowerCase())
    );
    setinputId(inputText);
    setsuggestions(suggestions);
  };

  //console.log("inputID is : ", inputId);
  //console.log("Suggestions is : ", suggestions);

  const showSuggestions = () => {
    if (suggestions.length == 0 && inputId == undefined) {
      return null;
    }
    if (suggestions.length > 0 && inputId == "") {
      return null;
    }
    if (suggestions.length == 0 && inputId) {
      return (
        <ul>
          <li>No Search Result Found</li>
        </ul>
      );
    }
    return (
      <ul>
        {suggestions.map((item, index) => (
          <li key={index} onClick={() => selectingRestaurant(item)}>
            {" "}
            <div><img src={item.image} alt="" className="suggestion-image" /></div><div className="suggestion-name">{" "}
            {`${item.name} - ${item.city} `}</div>
          </li>
        ))}
      </ul>
    );
  };

  const selectingRestaurant = (item) => {
    //console.log("selected restaurant is : ", item);
    navigate(`/details?restaurant=${item._id}`);
  };

  return (
<div>
  <Header />
  <div className="img-fluid img">
    <img src="./Assets/zomato.avif" className="img-fluid" alt="img Error" />
  </div>

  <div className="d-flex justify-content-center align-items-center flex-column main">
    <div className="center-label text-center">
      {/* <div className="logo">
        <img src="./Assets/icon.jpg" alt="" />
      </div> */}
      <h2 style={{ color: "#fff", fontWeight:'bold' }} className="h2">
        Find the best restaurants, cafes & bars
      </h2>

      <div className="row input-boxes">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <select
              name="State"
              id="select"
              className="form-select"
              aria-label="Default select example"
              onChange={(event) => getLocation(event)}
              style={{ cursor: "pointer"}}
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
              <div style={{ display: "flex" }}>
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
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="suggestions">{showSuggestions()}</div>
            </div>
          </div>
        </div>
    </div>
  </div>
</div>

  );
};

export default Wallpaper;
















