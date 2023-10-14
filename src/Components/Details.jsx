import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
  const [content_value, setconten_value] = useState(1);
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
    //console.log(response.data);
    setRestaurantData(response.data);
    // setMenuItem(menuItem.data)

    const findData = menu.data;

    findData.map((item) => {
      //console.log("menu-item is : ", item.menu_items);
      setMenuItem(item.menu_items);
    });
    //console.log("menu item is in state : ", menuItem);
  };

  const openOverview = () => {
    setconten_value(1);
  };
  const openContact = () => {
    setconten_value(2);
  };

  const handleOrder = (value) => {
    //console.log("order id is : ", value);
    setmenumodelIsOpen(value);
    //console.log("menu item is : ", menuItem);
  };

  const addItems = (index, operationType) => {
    let total = 0;
    const items = [...menuItem];
    const item = items[index];
    //console.log("index of item is : ", index);

    if (operationType == "add") {
      //console.log("add", item);
      item.qty += 1;
    } else {
      item.qty -= 1;
    }
    items[index] = item;
    items.map((item) => {
      //console.log("item qty is : ", item);
      total += item.qty * item.price;
    });
    setMenuItem(items);
    setSubTotal(total);
  };

  const handleFormDataChange = async (event, inputData) => {
    //console.log(event.target.value, inputData);
    if (inputData == "userEmail") {
      await setuserEmail(event.target.value);
      //console.log("Email is in state is : ", userEmail);
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
<Modal isOpen={menumodelIsOpen} className="menu-modal">
  <div className="modal-content" style={{ backgroundColor: "rgb(231, 196, 153)", border: "1px solid rgb(239, 136, 136)" }}>
    <div className="modal-header">
      <h5 className="modal-title">{restaurantData.name}</h5>
      <button type="button" className="btn-close" aria-label="Close" onClick={() => handleOrder(false)} style={{ color: "#000" }}></button>
    </div>
    <div className="modal-body">
      <div className="container">
        <div className="row">
          {menuItem.map((item, index) => {
            return (
              <div key={index} className="col-md-6 mb-4">
                <div className="card h-100" style={{ border: "none" }}>
                  <div className="card-body" style={{ padding: "20px" }}>
                    <div className="green-rectangle">
                      <div className="green-dot"></div>
                    </div>
                    <h5 className="card-title" style={{ fontSize: "24px", fontWeight: "bold" }}>{item.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: "20px", color: "#61b246" }}>₹{item.price}</h6>
                    <p className="card-text" style={{ fontSize: "16px" }}>{item.description}</p>
                    <img
                      src={item.image_url}
                      alt=""
                      className="card-img-top"
                      style={{ borderRadius: "10px", height: "200px", objectFit: "cover" }}
                    />
                    {item.qty === 0 ? (
                      <div className="add-button" onClick={() => addItems(index, "add")} style={{  fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
                        Add
                      </div>
                    ) : (
                      <div className="add-button" style={{display:'flex'}}>
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
                        <span style={{ fontSize: "15px", color: "#61b246", fontWeight: "600", marginRight: "10px" }}>
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

<div className="modal-footer">
  <div className="rectangle-3352">
    <span>SubTotal :</span>
    <span className="subtotal-price">&#8377;{SubTotal}</span>
    {/* <span className="rectangle-3353" onClick={() => setuserModalIsOpen(true)}> */}
    <span className="rectangle-3353" >
      Pay Now
    </span>
  </div>
</div>
  </div>
</Modal>
 
        <Modal
          // isOpen={galleryModalIsOpen}
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
