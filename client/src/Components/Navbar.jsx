import { Link } from "react-router-dom";
export default function Navbar() {
  // const handleRedirect = () => {
  //   window.location.href =
  //     "https://ayurvision-server.azurewebsites.net/chatbot"; // Redirect instantly
  // };

  // <button onClick={handleRedirect}>Go to Example</button>;

  return (
    <>
      <nav>
        <div className="nav-wrapper">
          <div className="logo_div flex justify-center items-center">
            <img
              className="h-16"
              src="leaf-s-logo-icon-vector-illustration-template-design_878729-1905-removebg-preview (1) (1).png"
            />
            <Link className="px-3" to="/">
              AyurVision
            </Link>
          </div>
          <ul>
            <li>
              <Link className="text-white" to="/">
                Home
              </Link>
              {/* <button className="text-white" onClick={handleRedirect}>
                Go to Example
              </button> */}
            </li>
            <li>
              <Link className="text-white" to="/MyForm">
                Prakriti
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
