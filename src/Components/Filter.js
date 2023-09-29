import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Components/Styles/Filter.css";
// import "../Components/Styles/home.css";
import Header from "./Header";
import axios from "axios";
const API = process.env.REACT_APP_BASE_URL

function Filter() {
  const [filterRestro, setfilterRestro] = useState([]);
  const [mealtypeName, setmealtypeName] = useState(undefined);
  const [filteredData, setfilteredData] = useState([])
  const [locations, setLocations] = useState([]);
  const [cuisine, setcuisine] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log("queryparams is : ", queryParams);
    const mealname = queryParams.get("mealname");
    const mealtypeValue = queryParams.get("mealtype");
    const locationId = queryParams.get("location");
    setmealtypeName(mealname)
    console.log("mealtypevalue is : ", mealtypeValue, locationId);
    console.log("from useeffect check mealtypevalue", typeof mealtypeValue);

    if (mealtypeValue !== null) {
      if (locationId !== null) {
        FilterRestro(mealtypeValue, locationId);
      } else {
        FilterRestro(mealtypeValue);
      }
    }

    getLocation();
  }, [location]);

  const getLocation = async () => {
    const loc = await axios.get(`${API}/locations`);
    console.log("This is thhe Location data: ", loc);
    setLocations(loc.data);
  };

  const FilterRestro = async (mealtype_id, locationId) => {
    // const mealtype_id = Number(paramValue)
    console.log("mealtype_id is : ", mealtype_id);
    console.log("location_id is : ", locationId);
    console.log(typeof mealtype_id);

    try {
      let apiUrl = `${API}/restroByMeal/${mealtype_id}`;
      if (locationId) {
        apiUrl = `${API}/restroByMeal&Location/${mealtype_id}/${locationId}`;
      }
      const response = await axios.get(apiUrl);
      console.log("Filtered restro is : ", response.data.restaurants);
      setfilterRestro(response.data.restaurants);
      setfilteredData(response.data.restaurants)
    } catch (error) {
      console.log("Error in fetching Filter restaurant api : ", error);
    }
  };

  console.log("Location data state: ", locations);

  const handleLocation = async (event) => {
    const selectLocation = event.target.value;

    const response = await axios.get(
      `${API}/restroByLocation/${selectLocation}`
    );
    console.log("Selected location data restro is : ", response.data);
    setfilterRestro(response.data.response);
    // console.log('selected location is : ',selectLocation)
  };

  const handleCuisine = async (cuisineId) => {
    // const index = cuisine.indexOf(cuisineId);
    // console.log('indexof cuisine is ', index)

    // if (index == -1) {
    //   cuisine.push(cuisineId);
    // } else {
    //   cuisine.splice(index, 1);
    // }
    // console.log("Htis is cuisine", cuisine);


    // const response = await axios.get(
    //   `${API}/restroByCuisine/${cuisine}`
    // );
    // console.log("Cuisine restros are: ", response.data.response);
    // setfilterRestro(response.data.response);
    setcuisine(cuisineId);
    
    if(!locations){
    axios
    .get(`${API}/restroByCuisine/${cuisineId}`)
    .then((response)=>{
      setfilterRestro(response.data.response)
    })
    .catch((error)=>{
      console.log(error)
    })
    }else{
      axios
      .get(`${API}/restroByCuisine/${cuisineId}`)
      .then((response)=>{
      setfilterRestro(response.data.response)
      })
      .catch((error)=>{
        console.log(error)
      })
      }
  };

  const handleCostChange = async (lcost, hcost) => {
    console.log("cost sort is ", lcost, hcost);
    const response = await axios.get(
      `${API}/restroByPriceRange/${lcost}/${hcost}`
    );
    console.log("Filter by price data is : ", response.data.response);
    setfilterRestro(response.data.response);
  };

  const handleSortChange = (event) => {
    const sortType = event.target.value;
  
    if (sortType === "lowToHigh") {
      const sortedRestaurants = filterRestro.slice().sort((a, b) => a.min_price - b.min_price);
      setfilterRestro(sortedRestaurants);
    } else if (sortType === "highToLow") {
      const sortedRestaurants = filterRestro.slice().sort((a, b) => b.min_price - a.min_price);
      setfilterRestro(sortedRestaurants);
    }
  };
  
  const handleNavigate = (data) =>{
    console.log('Item Clicked ....!', data._id)
    navigate(`/details?restaurant=${data._id}`)
  }

  return (
    <>
      <Header />
      <section className="main">
        <div className="container">
          <div className="row heading">{mealtypeName} places in Mumbai</div>
          <div className="row filter-box">
            <div className="col-3 col-sm-12 col-md-4 col-lg-3">
              <div className="filterPanel">
                <div className="filterPanelHeading">Filters</div>
                <div className="filterPanelSubHeading">Select Location</div>
                <select className="locationSelection" onChange={handleLocation}>
                  <option value="0">Select</option>
                  {locations.map((item, index) => {
                    return (
                      <option
                        value={item.location_id}
                      >{`${item.name}, ${item.city}`}</option>
                    );
                  })}
                </select>
                <div className="filterPanelSubHeading">Cuisine</div>
                <input
                  type="radio"
                  name="cuisine"
                  className="cuisineOption"
                  onChange={() => handleCuisine(1)}
                />
                <label>North Indian</label>
                <br />
                <input
                  type="radio"
                  name="cuisine"                  className="cuisineOption"
                  onChange={() => handleCuisine(2)}
                />
                <label>South Indian</label>
                <br />
                <input
                  type="radio"
                  name="cuisine"
                  className="cuisineOption"
                  onChange={() => handleCuisine(3)}
                />
                <label>Chinese</label>
                <br />
                <input
                  type="radio"
                  name="cuisine"
                  className="cuisineOption"
                  onChange={() => handleCuisine(4)}
                />
                <label>Fast Food</label>
                <br />
                <input
                  type="radio"
                  name="cuisine"
                  className="cuisineOption"
                  onChange={() => handleCuisine(5)}
                />
                <label>Street Food</label>
                <br />
                <div className="filterPanelSubHeading">Cost for two</div>
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => {
                    handleCostChange(1, 500);
                  }}
                />
                <label>Less than &#8377;500</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => {
                    handleCostChange(500, 1000);
                  }}
                />
                <label>&#8377;500 to &#8377;1000</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => {
                    handleCostChange(1000, 1500);
                  }}
                />
                <label>&#8377;1000 to &#8377;1500</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => {
                    handleCostChange(1500, 2000);
                  }}
                />
                <label>&#8377;1500 to &#8377;2000</label>
                <br />
                <input
                  type="radio"
                  className="cuisineOption"
                  name="cost"
                  onChange={() => {
                    handleCostChange(2000, 50000);
                  }}
                />
                <label>&#8377;2000+</label>
                <br />
                <div className="filterPanelSubHeading">Sort</div>
                <input type="radio" className="cuisineOption" name="price" value="lowToHigh" onChange={handleSortChange}/>
                <label>Price low to high</label>
                <br />
                <input type="radio" className="cuisineOption" name="price" value="highToLow" onChange={handleSortChange}/>
                <label>Price high to low</label>
              </div>
            </div>
            <div className="col-9 col-sm-12 col-md-8 col-lg-9">
              {filterRestro && filterRestro.length > 0 ? (
              filterRestro.map((data, index) => {
                  return (
                    <div key={index} className="resultsPanel" onClick={()=>(handleNavigate(data))} style={{ cursor: 'pointer', boxShadow: '0px 0px 10px #888888' , margin: "0 0 20px 0"  }}>
                      <div className="row upperSection">
                        <div className="col-2">
                          <img
                            src={`./${data.image}`}
                            className="resultsImage"
                            alt=""
                            width="120" height="120"
                          />
                        </div>
                        <div className="col-10 resultname">
                          <div className="resultsHeading">{data.name}</div>
                          <div className="resultsSubHeading">
                            {data.locality}
                          </div>
                          <div className="resultsAddress">{data.city}</div>
                        </div>
                      </div>
                      <br />
                      <div className="row lowerSection">
                        <div className="col-2">
                          <div className="resultsAddress">CUISINES:</div>
                          <div className="resultsAddress">COST FOR TWO:</div>
                        </div>
                        <div className="col-10">
                          <div className="resultsSubHeading">
                            {data.cuisine.map((cuisineData) => {
                              return `${cuisineData.name}`;
                            })}
                          </div>
                          <div className="resultsSubHeading">
                            &#8377;{data.min_price}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-records">No Records Found...</div>
              )}
            </div>
            {/* {filterRestro && filterRestro.length > 0 ? (
              <div className="pagination">
                <a href="#" className="paginationButton">
                  1
                </a>
                <a href="#" className="paginationButton">
                  2
                </a>
                <a href="#" className="paginationButton">
                  3
                </a>
                <a href="#" className="paginationButton">
                  4
                </a>
                <a href="#" className="paginationButton">
                  5
                </a>
                <a href="#" className="paginationButton">
                  6
                </a>
              </div>
            ) : null} */}
          </div>
        </div>
      </section>
    </>
  );
}

export default Filter;
