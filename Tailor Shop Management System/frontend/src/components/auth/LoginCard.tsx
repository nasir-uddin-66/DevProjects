import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const LoginCard = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login Success!");
        navigate("/user/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-80 rounded-2xl mt-8 py-6 px-8 md:px-10 shadow-2xl bg-linear-to-br from-[#282424] to-[#1b1717] border-2 border-[#1fb854] hover:shadow-green-500/20 transition-all duration-300">
        {/* Header with Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-linear-to-br from-[#1fb854] to-[#178a3f] rounded-full flex items-center justify-center mb-3 shadow-lg">
            <i className="fa-solid fa-sign-in-alt text-white text-xl"></i>
          </div>
          <h1 className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-[#1fb854] to-[#54c07a]">
            Welcome Back
          </h1>
          <p className="text-[#30ce67] text-xs mt-1 opacity-75">Sign in to your account</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="flex text-[#54c07a] font-semibold text-sm mb-1 items-center gap-2"
          >
            <i className="fa-solid fa-envelope text-[#1fb854]"></i>
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="input input-bordered w-full bg-[#1b1717] text-[#30ce67] placeholder:text-[#30ce67] placeholder:opacity-40 border-[#1fb854] focus:border-[#54c07a] focus:outline-none focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-30 input-sm"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="flex text-[#54c07a] font-semibold text-sm mb-1 items-center gap-2"
          >
            <i className="fa-solid fa-lock text-[#1fb854]"></i>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input input-bordered w-full bg-[#1b1717] text-[#30ce67] placeholder:text-[#30ce67] placeholder:opacity-40 border-[#1fb854] focus:border-[#54c07a] focus:outline-none focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-30 input-sm"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 text-[#1fb854] hover:text-[#54c07a] cursor-pointer text-sm transition-colors"
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="btn btn-sm w-full bg-linear-to-r from-[#1fb854] to-[#178a3f] border-0 text-white font-bold hover:shadow-lg hover:shadow-[#1fb854]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Logging in...
            </>
          ) : (
            <>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              Login
            </>
          )}
        </button>

        {/* Divider */}
        <div className="divider divider-neutral my-4 before:bg-[#1fb854] after:bg-[#1fb854]"></div>

        {/* Sign Up Link */}
        <p className="text-center text-[#30ce67] text-xs">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-[#54c07a] hover:text-[#1fb854] underline transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginCard;
