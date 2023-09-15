import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Filter from "./Filter";
import CarouselPage from "./Details";
// import Header from "./Header";

const Router = () => {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
      {/* <Switch> */}
        <Route exact path="/" element={<Home />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="details" element={<CarouselPage />} />
        {/* <Redirect to="/404" />
      </Switch> */}
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
