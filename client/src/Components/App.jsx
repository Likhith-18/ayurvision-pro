import Home from "./Home";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyForm from "./MyForm";
import ImagePredict from "./ImagePredict";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/myform" Component={MyForm} />
          <Route path="/image-predict" Component={ImagePredict} />
        </Routes>
      </div>
    </Router>
  );
}
