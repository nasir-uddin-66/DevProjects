// User ProfileEditPage - edit profile

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Layout from "../../components/common/Layout";
import UserSidebar from "../../components/user/UserSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../api/services";

export default function ProfileEditPage() {
  const { user, updateUserContext } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updatedUser = await userService.updateUser(user.id, formData);
      if (updatedUser) {
        updateUserContext(updatedUser);
        toast.success("Profile updated successfully!");
        navigate("/user/profile");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout sidebar={<UserSidebar />} title="">
      <div className="min-h-screen bg-[#1b1717] py-12 px-5">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1fb854] to-[#178a3f] rounded-t-xl p-8 text-white mb-0">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-user-pen"></i>
              Edit Your Profile
            </h1>
            <p className="text-white opacity-90 mt-2">
              Update your personal information
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#282424] border border-[#1fb854] rounded-b-xl p-8">
            {/* Back Button */}
            <Link
              to="/user/profile"
              className="inline-flex items-center gap-2 text-[#1fb854] hover:text-[#54c07a] font-semibold mb-8 transition"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Profile
            </Link>

            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="mb-8">
                <label
                  htmlFor="fullname"
                  className="text-[#54c07a] font-semibold text-sm block mb-3"
                >
                  <i className="fa-solid fa-user mr-2"></i>Full Name
                </label>
                <input
                  id="fullname"
                  className="w-full px-4 py-3 bg-[#1b1717] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-20 transition placeholder:text-[#30ce67] placeholder:opacity-50"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email Field */}
              <div className="mb-8">
                <label
                  htmlFor="email"
                  className="text-[#54c07a] font-semibold text-sm block mb-3"
                >
                  <i className="fa-solid fa-envelope mr-2"></i>Email Address
                </label>
                <input
                  id="email"
                  className="w-full px-4 py-3 bg-[#1b1717] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-20 transition placeholder:text-[#30ce67] placeholder:opacity-50"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="mb-8">
                <label
                  htmlFor="phone"
                  className="text-[#54c07a] font-semibold text-sm block mb-3"
                >
                  <i className="fa-solid fa-phone mr-2"></i>Phone Number
                </label>
                <input
                  id="phone"
                  className="w-full px-4 py-3 bg-[#1b1717] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-20 transition placeholder:text-[#30ce67] placeholder:opacity-50"
                  type="text"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              {/* Address Field */}
              <div className="mb-8">
                <label
                  htmlFor="address"
                  className="text-[#54c07a] font-semibold text-sm block mb-3"
                >
                  <i className="fa-solid fa-location-dot mr-2"></i>Address
                </label>
                <input
                  id="address"
                  className="w-full px-4 py-3 bg-[#1b1717] border-2 border-[#1fb854] rounded-lg text-[#30ce67] focus:outline-none focus:border-[#54c07a] focus:ring-2 focus:ring-[#1fb854] focus:ring-opacity-20 transition placeholder:text-[#30ce67] placeholder:opacity-50"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-[#1fb854]">
                <button
                  type="submit"
                  className="flex-1 bg-[#1fb854] hover:bg-[#178a3f] text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  Save Changes
                </button>
                <Link
                  to="/user/profile"
                  className="flex-1 bg-[#282424] hover:bg-[#1b1717] text-[#54c07a] border-2 border-[#1fb854] font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-times"></i>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
