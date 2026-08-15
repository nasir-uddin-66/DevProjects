import { Link } from "react-router";
// import logo from "../../assets/brand_logo.png";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function Navbar() {
  const [expandNavbar, setExpandNavbar] = useState<boolean>(true);
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`md:flex justify-between items-center px-5 md:px-10 h-15 max-w-5xl ${
        theme === "light"
          ? "bg-[#e8e3de] border-b-2 border-[#1fb854]"
          : "bg-[#1b1717] border-b-2 border-[#178a3f]"
      } mx-auto`}
    >
      {/* logo */}
      <div className="w-full md:w-55 lg:w-80 flex items-center justify-between h-full">
        <Link
          to="/"
          style={{
            fontFamily: "Lobster",
          }}
          className={`text-xl md:text-3xl hover:scale-105 transition ${
            theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
          }`}
        >
          StitchCraft
        </Link>
        <div
          onClick={() => setExpandNavbar((prev) => !prev)}
          className="md:hidden cursor-pointer scale-80"
        >
          {expandNavbar ? (
            <i
              className={`fa-solid fa-bars transition duration-105 ${
                theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
              }`}
            ></i>
          ) : (
            <i
              className={`fa-solid fa-x transition duration-105 ${
                theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
              }`}
            ></i>
          )}
        </div>
      </div>
      {/* nav items */}
      <div
        className={`${
          expandNavbar ? "-mt-200 opacity-0" : "mt-1 opacity-100"
        } h-45 md:h-auto md:mt-0 md:opacity-100 flex-1 flex flex-col md:flex-row justify-evenly md:justify-end rounded-b-xl items-center ${
          theme === "light"
            ? "bg-[#dcd5ce] md:bg-[#e8e3de] md:border-0 border border-t-0 border-[#1fb854]"
            : "bg-[#272020] md:bg-[#1b1717] md:border-0 border border-t-0 border-[#178a3f]"
        }`}
        style={{ transition: "opacity 0.1s ease-in-out" }}
      >
        <Link
          to="/"
          className={`font-bold scale-60 md:scale-80 md:hover:scale-85 transition duration-30 ${
            theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
          }`}
        >
          Home
        </Link>

        {/* <Link
          to="/about"
          className="font-bold scale-60 md:scale-80 md:hover:scale-85 transition duration-30 md:ms-8 lg:ms-10 text-[#54c07a]"
        >
          About Us
        </Link> */}

        <Link
          to="/contact"
          className={`font-bold scale-60 md:scale-80 md:hover:scale-85 transition duration-30 md:ms-8 lg:ms-10 ${
            theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
          }`}
        >
          Contact Us
        </Link>

        <Link
          to="/login"
          className="btn btn-primary scale-60 md:scale-80 md:hover:scale-85 transition duration-30 md:ms-8 lg:ms-10"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="btn btn-outline btn-primary scale-60 md:scale-80 md:hover:scale-85 transition duration-30 md:ms-8 lg:ms-10"
        >
          Signup
        </Link>

        <button
          onClick={toggleTheme}
          className={`scale-60 md:scale-80 md:hover:scale-85 transition duration-30 md:ms-8 lg:ms-10 ${
            theme === "light"
              ? "text-[#178a3f] hover:text-[#1fb854]"
              : "text-[#54c07a] hover:text-[#30ce67]"
          }`}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <i className="fa-solid fa-sun text-lg"></i>
          ) : (
            <i className="fa-solid fa-moon text-lg"></i>
          )}
        </button>
      </div>
    </div>
  );
}
