import Navbar from "./Navbar";
// import MyForm from "./MyForm";
import ChatBot from "./ChatBot";
import Footer from "./Footer";
// import Card from './Card';

export default function Home() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div style={{ marginTop: "30px" }}>
        <ChatBot />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
