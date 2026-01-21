import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurantLogin.css";

export default function RestaurantLogin() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  // This forces the background to be light and blocks the black global style
  const wrapperStyle = {
    backgroundColor: "#c9d6ff",
    backgroundImage: "linear-gradient(to right, #e2e2e2, #c9d6ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    fontFamily: "'Inter', sans-serif"
  };

  const formBaseStyle = {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "0 40px",
    height: "100%"
  };

  return (
    <div style={wrapperStyle}>
      <div className={`container ${isActive ? "active" : ""}`} id="container">

        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form style={formBaseStyle}>
            <h1 className="title">Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className='bx bxl-google'></i></a>
              <a href="#" className="icon"><i className='bx bxl-facebook'></i></a>
              <a href="#" className="icon"><i className='bx bxl-github'></i></a>
              <a href="#" className="icon"><i className='bx bxl-linkedin'></i></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="button" className="btn-main">Sign Up</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="form-container sign-in">
          <form style={formBaseStyle}>
            <h1 className="title">Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className='bx bxl-google'></i></a>
              <a href="#" className="icon"><i className='bx bxl-facebook'></i></a>
              <a href="#" className="icon"><i className='bx bxl-github'></i></a>
              <a href="#" className="icon"><i className='bx bxl-linkedin'></i></a>
            </div>
            <span>or use your email password</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#" className="forgot">Forgot Your Password?</a>
            <button type="button" className="btn-main" onClick={() => navigate('/1/orders')}>Sign In</button>
          </form>
        </div>

        {/* The Blue Toggle Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your details to use all site features</p>
              <button className="hidden" onClick={() => setIsActive(false)}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your details to use all site features</p>
              <button className="hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}