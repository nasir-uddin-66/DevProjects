import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const SignupCard = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const success = await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone,
        formData.address
      );
      if (success) {
        toast.success("Signup Success!");
        navigate("/user/dashboard");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-2 rounded-2xl py-6 px-8 md:px-12 shadow-2xl bg-linear-to-br from-[#282424] to-[#1b1717] border-2 border-[#1fb854] hover:shadow-green-500/20 transition-all duration-300">
        {/* Header with Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-linear-to-br from-[#1fb854] to-[#178a3f] rounded-full flex items-center justify-center mb-3 shadow-lg">
            <i className="fa-solid fa-user-plus text-white text-xl"></i>
          </div>
          <h1 className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-[#1fb854] to-[#54c07a]">
            Join Us
          </h1>
          <p className="text-[#30ce67] text-xs mt-1 opacity-75">
            Create your account
          </p>
        </div>

        {/* Form Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Full Name Input */}
          <div>
            <label
              htmlFor="fullName"
              className="flex text-[#54c07a] font-semibold text-sm mb-1 items-center gap-2"
            >
              <i className="fa-solid fa-user text-[#1fb854]"></i>
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full bg-[#1b1717] text-[#30ce67] placeholder:text-[#30ce67] placeholder:opacity-40 border-[#1fb854] focus:border-[#54c07a] focus:outline-none focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-30 input-sm"
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          {/* Email Input */}
          <div>
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
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="flex text-[#54c07a] font-semibold text-sm mb-1 items-center gap-2"
            >
              <i className="fa-solid fa-phone text-[#1fb854]"></i>
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+880 1234567890"
              className="input input-bordered w-full bg-[#1b1717] text-[#30ce67] placeholder:text-[#30ce67] placeholder:opacity-40 border-[#1fb854] focus:border-[#54c07a] focus:outline-none focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-30 input-sm"
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          {/* Address Input */}
          <div>
            <label
              htmlFor="address"
              className="flex text-[#54c07a] font-semibold text-sm mb-1 items-center gap-2"
            >
              <i className="fa-solid fa-map-marker-alt text-[#1fb854]"></i>
              Address
            </label>
            <input
              type="text"
              placeholder="123 Street, City"
              className="input input-bordered w-full bg-[#1b1717] text-[#30ce67] placeholder:text-[#30ce67] placeholder:opacity-40 border-[#1fb854] focus:border-[#54c07a] focus:outline-none focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-30 input-sm"
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          {/* Password Input */}
          <div>
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1fb854] hover:text-[#54c07a] cursor-pointer text-sm transition-colors z-10"
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="flex text-[#54c07a] font-semibold text-sm mb-1 items-center gap-2"
            >
              <i className="fa-solid fa-check-circle text-[#1fb854]"></i>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full bg-[#1b1717] text-[#30ce67] placeholder:text-[#30ce67] placeholder:opacity-40 border-[#1fb854] focus:border-[#54c07a] focus:outline-none focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-30 input-sm"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1fb854] hover:text-[#54c07a] cursor-pointer text-sm transition-colors z-10"
              >
                <i
                  className={`fa-solid ${
                    showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="btn btn-sm w-full bg-linear-to-r from-[#1fb854] to-[#178a3f] border-0 text-white font-bold hover:shadow-lg hover:shadow-[#1fb854]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Creating Account...
            </>
          ) : (
            <>
              <i className="fa-solid fa-user-check"></i>
              Sign Up
            </>
          )}
        </button>

        {/* Divider */}
        <div className="divider divider-neutral my-4 before:bg-[#1fb854] after:bg-[#1fb854]"></div>

        {/* Login Link */}
        <p className="text-center text-[#30ce67] text-xs">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#54c07a] hover:text-[#1fb854] underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignupCard;
