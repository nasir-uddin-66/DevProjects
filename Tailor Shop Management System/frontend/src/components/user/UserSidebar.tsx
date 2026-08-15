import { Link } from "react-router";
import { useTheme } from "../../contexts/ThemeContext";

const UserSidebar = () => {
  const { theme } = useTheme();
  const menuItems = [
    { label: "Dashboard", path: "/user/dashboard", icon: "fa-chart-line" },
    { label: "Your Profile", path: "/user/profile", icon: "fa-user" },
    {
      label: "Place New Order",
      path: "/user/orders/new",
      icon: "fa-plus-circle",
    },
    { label: "My Orders", path: "/user/orders", icon: "fa-list" },
  ];

  return (
    <div
      className={`${theme === "light" ? "bg-[#dcd5ce]" : "bg-[#282424]"
        } w-64 border-r-2 border-[#1fb854] h-full`}
    >
      {/* Header */}
      <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] p-6 border-b-2 border-[#1fb854]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-user-circle"></i>
          Menu
        </h2>
      </div>

      {/* Menu Items */}
      <div className="py-4">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`px-6 py-4 font-semibold hover:transition duration-200 border-l-4 border-transparent hover:border-[#1fb854] flex items-center gap-3 group ${theme === "light"
                ? "text-[#178a3f] hover:bg-[#ebe5de] hover:text-[#1fb854]"
                : "text-[#30ce67] hover:bg-[#1b1717] hover:text-[#1fb854]"
              }`}
          >
            <i
              className={`fa-solid ${item.icon} text-[#1fb854] group-hover:scale-110 transition`}
            ></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Footer Info */}
      <div
        className={`absolute bottom-0 left-0 right-0 ${theme === "light"
            ? "bg-[#d0c9c2] border-t-2 border-[#1fb854]"
            : "bg-[#1b1717] border-t-2 border-[#1fb854]"
          } p-4 w-64`}
      >
        <p
          className={`text-xs text-center ${theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
            }`}
        >
          <i className="fa-solid fa-lock text-[#1fb854] mr-1"></i>
          Secure Dashboard
        </p>
      </div>
    </div>
  );
};

export default UserSidebar;
