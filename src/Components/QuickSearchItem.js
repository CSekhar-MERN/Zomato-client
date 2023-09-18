import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API = process.env.REACT_APP_BASE_URL

function QuickSearchItem() {
  const [mealTypes, setmealTypes] = useState([]);

  useEffect(() => {
    fetchMealType();
    sessionStorage.clear();
  }, []);

  const fetchMealType = async () => {
    try {
      const response = await axios.get(`${API}/mealtypes`);
      console.log("MealType fetched data is : ", response.data);
      setmealTypes(response.data);
    } catch (error) {
      console.log("Error in fetching MealType Data : ", error);
      console.log("Error details:", error.response);
    }
  };

  const navigate = useNavigate();
  const handleNavigation = (id) => {
    const locationId = sessionStorage.getItem("locationId");
    console.log('This is location id : ',locationId)
    if (locationId) {
      navigate(`/filter?mealtype=${id}&location=${locationId}`);
    } else {
      navigate(`/filter?mealtype=${id}`);
    }
    console.log("Navigation executed!", id);
  };

  return (
    <div>
      <div className="container-fluid ">
        <div className="container px-4 text-center">
          <div className="row  gx-5">
            {mealTypes.map((meal) => {
              return (
                <div
                  className="col-lg-4 col-md-6 col-sm-12"
                  key={meal.id}
                  onClick={() => {
                    handleNavigation(meal.meal_type);
                  }}
                >
                  <div className="p-3">
                    <div
                      className="card mb-3"
                      style={{ maxWidth: "540px", maxHeight: "540px" }}
                    >
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src="./Assets/pizza.jpg"
                            className="img-fluid rounded-start"
                            alt="..."
                            style={{ height: "100%" }}
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <h5 className="card-title">{meal.name}</h5>
                            <p className="card-text">{meal.content}</p>
                            <p className="card-text">
                              <small className="text-body-secondary">
                                Last updated 3 mins ago
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default QuickSearchItem;
