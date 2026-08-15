import { useNavigate } from "react-router";
import { useTheme } from "../../contexts/ThemeContext";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        theme == "dark"
          ? "bg-linear-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]"
          : "bg-linear-to-br from-[#f8f8f8] via-[#ffffff] to-[#f0f0f0]"
      }`}
    >
      <div className="text-center max-w-md w-full">
        {/* 404 Number */}
        <div className="mb-8">
          <div
            className={`text-9xl font-black mb-4 transition-colors duration-300 ${
              theme == "dark"
                ? "bg-linear-to-r from-[#1fb854] to-[#54c07a] text-transparent bg-clip-text"
                : "bg-linear-to-r from-[#1fb854] to-[#54c07a] text-transparent bg-clip-text"
            }`}
          >
            404
          </div>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <i
            className={`fa-solid fa-triangle-exclamation text-6xl transition-colors duration-300 ${
              theme == "dark" ? "text-[#ff6b6b]" : "text-[#ff6b6b]"
            }`}
          ></i>
        </div>

        {/* Heading */}
        <h1
          className={`text-3xl md:text-4xl font-bold mb-3 transition-colors duration-300 ${
            theme == "dark" ? "text-white" : "text-[#282424]"
          }`}
        >
          Page Not Found
        </h1>

        {/* Description */}
        <p
          className={`text-lg mb-8 leading-relaxed transition-colors duration-300 ${
            theme == "dark" ? "text-[#b0b0b0]" : "text-[#666666]"
          }`}
        >
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2
              bg-[#1fb854] text-white hover:bg-[#18a547] active:scale-95 shadow-lg hover:shadow-xl"
          >
            <i className="fa-solid fa-home"></i>
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
              theme == "dark"
                ? "border-[#1fb854] text-[#1fb854] hover:bg-[#1fb854] hover:text-white"
                : "border-[#1fb854] text-[#1fb854] hover:bg-[#1fb854] hover:text-white"
            }`}
          >
            <i className="fa-solid fa-arrow-left"></i>
            Go Back
          </button>
        </div>

        {/* Decorative Element */}
        <div
          className="mt-12 pt-8 border-t border-opacity-20 transition-colors duration-300"
          style={{
            borderColor:
              theme == "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <p
            className={`text-sm transition-colors duration-300 ${
              theme == "dark" ? "text-[#888888]" : "text-[#999999]"
            }`}
          >
            <i className="fa-solid fa-lightbulb mr-2"></i>
            Try checking the URL for typos or go back to explore more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

