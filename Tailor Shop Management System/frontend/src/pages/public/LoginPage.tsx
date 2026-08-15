import bg4 from "../../assets/bg/bg-4.png";
import LoginCard from "../../components/auth/LoginCard.tsx";
import { Link } from "react-router";

const LoginPage = () => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6)), url(${bg4})`,
        backgroundSize: "cover",
      }}
      className="h-screen"
    >
      <div className="flex items-center md:px-3 h-15 max-w-5xl bg-[#1b1717] border-b-2 border-[#1fb854] mx-auto">
        <Link
          to="/"
          className="btn btn-ghost btn-xs text-[0.5rem] md:text-[0.6rem] mx-1 text-[#1fb854]"
        >
          <i className="fa-solid fa-arrow-left"></i> BACK TO HOME
        </Link>
      </div>

      <div className="flex justify-center items-center">
        <LoginCard />
      </div>
    </div>
  );
};

export default LoginPage;

