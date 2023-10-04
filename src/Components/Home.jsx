import React from "react";
import "../Components/Styles/home.css";
import Wallpaper from "./Wallpaper";
import QuickSearch from "./QuickSearch";
import QuickSearchItem from "./QuickSearchItem";
// import Filter from "./Filter";

function Home() {
  return (
    <div>
      <Wallpaper />
      {/* <Filter/> */}
      <div className="main container-fluid" style={{ width: "80%" }}>
        <QuickSearch />
        <QuickSearchItem />
      </div>
    </div>
  );
}
export default Home;
