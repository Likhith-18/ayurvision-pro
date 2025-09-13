import Home from "./Home";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Prakriti from "./Prakriti";
import ImagePredict from "./ImagePredict";
import NearbyDoctorsMap from "../pages/NearbyDoctersMap";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/my-form" Component={Prakriti} />
          <Route path="/image-predict" Component={ImagePredict} />
          <Route path="/find-doctors" Component={NearbyDoctorsMap} />
        </Routes>
      </div>
    </Router>
  );
}
