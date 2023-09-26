import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Header from "./Header";
import "../Components/Styles/Details.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
// import queryString from 'querystring'
const API = process.env.REACT_APP_BASE_URL;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "antiquewhite",
    border: "1px solid brown",
  },
};

const menuStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(231, 196, 153)",
    border: "1px solid rgb(239, 136, 136)",
    padding: "2em",
    width: "50vw",
  },
};

function CarouselPage() {
  const [restaurantData, setRestaurantData] = useState([]);
  const [menuItem, setMenuItem] = useState([]);
  const [content_value, setconten_value] = useState([]);
  const [menumodelIsOpen, setmenumodelIsOpen] = useState(false);
  const [galleryModalIsOpen, setgalleryModalIsOpen] = useState(false);
  const [userModalIsOpen, setuserModalIsOpen] = useState(false);
  const [SubTotal, setSubTotal] = useState(0);
  const [userEmail, setuserEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    getRestro();
  }, []);

  const queryParams = new URLSearchParams(location.search);
  // console.log("queryparams is : ", queryParams);

  const restaurant = queryParams.get("restaurant");
  // console.log(restaurant);

  const getRestro = async () => {
    const response = await axios.get(`${API}/restroById/${restaurant}`);
    const menu = await axios.get(`${API}/menuItem/${restaurant}`);
    console.log(response.data);
    setRestaurantData(response.data);
    // setMenuItem(menuItem.data)

    const findData = menu.data;

    findData.map((item) => {
      console.log("menu-item is : ", item.menu_items);
      setMenuItem(item.menu_items);
    });
    console.log("menu item is in state : ", menuItem);
  };

  const openOverview = () => {
    setconten_value(1);
  };
  const openContact = () => {
    setconten_value(2);
  };

  const handleOrder = (value) => {
    console.log("order id is : ", value);
    setmenumodelIsOpen(value);
    console.log("menu item is : ", menuItem);
  };

  const addItems = (index, operationType) => {
    let total = 0;
    const items = [...menuItem];
    const item = items[index];
    console.log("index of item is : ", index);

    if (operationType == "add") {
      console.log("add", item);
      item.qty += 1;
    } else {
      item.qty -= 1;
    }
    items[index] = item;
    items.map((item) => {
      console.log("item qty is : ", item);
      total += item.qty * item.price;
    });
    setMenuItem(items);
    setSubTotal(total);
  };

  const handleFormDataChange = async (event, inputData) => {
    console.log(event.target.value, inputData);
    if (inputData == "userEmail") {
      await setuserEmail(event.target.value);
      console.log("Email is in state is : ", userEmail);
    }
  };

  const handlePayment = () => {
    if (!userEmail) {
      alert("Please fill this field and then Proceed...");
    } else {
    }
    const data = {
      amout: SubTotal,
      email: userEmail,
      mobileNo: "8954123",
    };
  };

  return (
    <>
      <Header />
      <div className="details">
        <h1>Details Page</h1>
        <div className="img-fluid">
          <img src={restaurantData.image} alt="" />
          <button
            className="gallery-button"
            onClick={() => {
              setgalleryModalIsOpen(true);
            }}
          >
            Click to see Image Gallery{" "}
          </button>
        </div>
        {/* <Carousel showArrows={true} showThumbs={false}>
          {restaurantData.thumb &&
            restaurantData.thumb.map((item, index) => {
              console.log('thum items is : '+item)
              return (
              <div>
                <img src={("./"+ item)} alt="not Found" style={{height:'35vh'}}/>
                <button
                  className="gallery-button"
                  onClick={() => {
                    setgalleryModalIsOpen(true);
                  }}
                >
                  Click to see Image Gallery{" "}
                </button>
              </div>
            )})}
            </Carousel> */}
        {/* <div>
            <img
              src="./Assets/breakfast.jpg"
              alt=""
              srcset=""
              style={{ height: "15vh", width: "15vw" }}
            />
          </div>
          <div>
            <img
              src="./Assets/breakfast.jpg"
              alt=""
              srcset=""
              style={{ height: "15vh", width: "15vw" }}
            />
          </div> */}

        {/* <Tabs>
          <h1 className="restaurant-name">
            <strong>{restaurantData.name}</strong>
          </h1>
          <div className="btn-div">
            <button className="order-button" onClick={() => handleOrder(true)}>
              {" "}
              Place Online Order
            </button>
          </div>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Contact</Tab>
          </TabList>
          <TabPanel>
            <h2>About this place</h2>
            <br />
            <h3>Cuisine</h3>
            {restaurantData.cuisine ? (
              <p>
                Bakery:{" "}
                {restaurantData.cuisine.map((item, index) => (
                  <span key={index}>
                    {item.name}
                    {index !== restaurantData.cuisine.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            ) : (
              <p>No cuisine data available</p>
            )}

            <h3>Average Cost</h3>
            <p>${restaurantData.min_price} for two people (approx.)</p>
          </TabPanel>
          <TabPanel>
            <h2>Phone Number</h2>
            <p>{restaurantData.contact_number}</p>
            <h3>
              <strong>{restaurantData.name}</strong>
            </h3>
            <h5>{restaurantData.locality + ", " + restaurantData.city}</h5>
          </TabPanel>
        </Tabs> */}
        <div className="restaurant-name">{restaurantData.name}</div>
        <button className="order-button" onClick={() => handleOrder(true)}>
          {" "}
          Place Online Order
        </button>
        <div className="btn-box">
          <button
            className="btn-1"
            style={
              content_value == 1 ? { color: "#ce0505" } : { color: "black" }
            }
            onClick={openOverview}
          >
            Overview
          </button>
          <button
            className="btn-2"
            style={
              content_value == 2 ? { color: "#ce0505" } : { color: "black" }
            }
            onClick={openContact}
          >
            Contact
          </button>
        </div>
        <div className="path"></div>
        <div
          id="content1"
          className="content"
          style={
            content_value === 1 ? { display: "block" } : { display: "none" }
          }
        >
          <div
            className="restaurant-name2"
            style={{ marginTop: "20px", marginBottom: "30px" }}
          >
            About this place
          </div>
          <div className="cuisine-detail">Cuisine</div>
          <div className="address" style={{ marginBottom: "30px" }}>
            {restaurantData.cuisine
              ? restaurantData.cuisine.map((item) => `${item.name} `)
              : null}
          </div>
          <div className="cuisine-detail">Average Cost</div>
          <div className="address" style={{ marginBottom: "0px" }}>
            ₹{restaurantData.min_price} for two people (approx)
          </div>
        </div>
        <div
          id="content2"
          className="content"
          style={
            content_value === 2 ? { display: "block" } : { display: "none" }
          }
        >
          <div className="phone-number" style={{ marginTop: "30px" }}>
            Phone Number
          </div>
          <div className="number" style={{ marginBottom: "30px" }}>
            {restaurantData.contact_number}
          </div>
          <div className="restaurant-name2">{restaurantData.name}</div>
          <div className="address" style={{ marginBottom: "50px" }}>
            {restaurantData.locality + ", " + restaurantData.city}
          </div>
        </div>

        <Modal isOpen={menumodelIsOpen} style={menuStyles}>
          <div
            style={{ padding: "7px" , cursor:'pointer'}}
            className="carousel-button"
            onClick={() => handleOrder(false)}
          >
            <i class="fa-solid fa-xmark"></i>
          </div>
          <div className="menu-modal">
            {/* <h1><strong>Menu</strong></h1> */}
            <div className="container">
              <div className="restaurant-menu-title">{restaurantData.name}</div>

              {menuItem.map((item, index) => {
                return (
                  <div>
                    <div className="green-rectangle">
                      <div className="green-dot"></div>
                    </div>
                    <div style={{ display: "inline-block" }}>
                      <div className="Gobi-Manchurian">{item.name}</div>
                      <div className="menu-price">₹{item.price}</div>
                      <div className="menu-content">{item.description}</div>
                    </div>

                    <div
                      style={{ display: "inline-block", verticalAlign: "top" }}
                    >
                      <img
                        src={item.image_url}
                        alt=""
                        height="92"
                        width="92"
                        style={{ borderRadius: "10px" }}
                      />
                      {item.qty === 0 ? (
                        <div
                          className="add-button"
                          onClick={() => addItems(index, "add")}
                        >
                          Add
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <span
                            style={{
                              fontSize: "15px",
                              color: "grey",
                              fontWeight: "600",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => addItems(index, "subtract")}
                          >
                            -
                          </span>
                          <span
                            style={{
                              fontSize: "15px",
                              color: "#61b246",
                              fontWeight: "600",
                              marginRight: "10px",
                            }}
                          >
                            {item.qty}
                          </span>
                          <span
                            style={{
                              fontSize: "15px",
                              color: "#61b246",
                              fontWeight: "600",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => addItems(index, "add")}
                          >
                            +
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      style={
                        index === menuItem.length - 1
                          ? { display: "none" }
                          : { display: "block" }
                      }
                      className="Path-6229"
                    ></div>
                  </div>
                );
              })}
            </div>

            <div className="Rectangle-3352">
              <span>SubTotal :</span>
              <span className="Subtotal-price">&#8377;{SubTotal}</span>
              {/* <span
                className="Rectangle-3353"
                onClick={() => {
                  setuserModalIsOpen(true);
                }}
              > */}
              <span className="Rectangle-3353">Pay Now</span>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={galleryModalIsOpen}
          style={customStyles}
          ariaHideApp={false}
        >
          <div>
            <div
              style={{ float: "right", display: "block" }}
              onClick={() => setgalleryModalIsOpen(false)}
            >
              <i class="fa-solid fa-xmark"></i>
            </div>

            <Carousel
              showThumbs={true}
              showIndicators={false}
              dynamicHeight={true}
              infiniteLoop={true}
            >
              {restaurantData && restaurantData.thumb
                ? restaurantData.thumb.map((item, id) => {
                    return (
                      <div className="img-fluid" key={id}>
                        {" "}
                        <img src={`./${item}`} alt="not Found" />{" "}
                      </div>
                    );
                  })
                : null}
            </Carousel>
          </div>
        </Modal>
        <Modal isOpen={userModalIsOpen} style={menuStyles}>
          <div>
            <div
              style={{ float: "right", display: "block" }}
              onClick={() => setuserModalIsOpen(false)}
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
            <div>{restaurantData.name}</div>
            <div>
              <label>Name :</label> <br />
              <input
                type="text"
                name="name"
                id="name"
                style={{ width: "400px" }}
                onChange={(event) => {
                  handleFormDataChange(event, "userName");
                }}
              />
            </div>
            <div>
              <label>Email :</label>
              <br />
              <input
                type="email"
                name="email"
                id="email"
                style={{ width: "400px" }}
                onChange={(event) => {
                  handleFormDataChange(event, "userEmail");
                }}
              />
            </div>
            <div>
              <label>Address :</label>
              <br />
              <input
                type="text"
                name="address"
                id="address"
                style={{ width: "400px" }}
                onChange={(event) => {
                  handleFormDataChange(event, "userAddress");
                }}
              />
            </div>
            <div>
              <label>Contact-Number :</label>
              <br />
              <input
                type="number"
                name="number"
                id="number"
                style={{ width: "400px" }}
                onChange={(event) => {
                  handleFormDataChange(event, "userContact");
                }}
              />
            </div>
            <div>
              <button style={{ marginTop: "20px" }} onClick={handlePayment}>
                Proceed
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
export default CarouselPage;
