import Home from "./Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyForm from "./MyForm";
import ChatBot from "./ChatBot";
export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MyForm" element={<MyForm />} />
          {/* <Route path="/Chatbot" element={<ChatBot />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
