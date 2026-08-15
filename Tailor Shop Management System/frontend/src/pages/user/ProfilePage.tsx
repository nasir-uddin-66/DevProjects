// User ProfilePage - view profile

import { Link } from "react-router";
import Layout from "../../components/common/Layout";
import UserSidebar from "../../components/user/UserSidebar";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Layout sidebar={<UserSidebar />} title="">
      <div className="min-h-screen bg-[#1b1717] py-12 px-5">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1fb854] to-[#178a3f] rounded-t-xl p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-user text-3xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.fullName}</h1>
                <p className="text-white opacity-90">Personal Information</p>
              </div>
            </div>
          </div>

          {/* Profile Details Card */}
          <div className="bg-[#282424] border border-[#1fb854] rounded-b-xl p-8">
            {/* Full Name */}
            <div className="mb-8 pb-8 border-b border-[#1fb854]">
              <label className="text-[#54c07a] font-semibold text-sm block mb-2">
                <i className="fa-solid fa-user mr-2"></i>Full Name
              </label>
              <p className="text-[#30ce67] text-lg">{user.fullName}</p>
            </div>

            {/* Email */}
            <div className="mb-8 pb-8 border-b border-[#1fb854]">
              <label className="text-[#54c07a] font-semibold text-sm block mb-2">
                <i className="fa-solid fa-envelope mr-2"></i>Email Address
              </label>
              <p className="text-[#30ce67] text-lg">{user.email}</p>
            </div>

            {/* Phone */}
            <div className="mb-8 pb-8 border-b border-[#1fb854]">
              <label className="text-[#54c07a] font-semibold text-sm block mb-2">
                <i className="fa-solid fa-phone mr-2"></i>Phone Number
              </label>
              <p className="text-[#30ce67] text-lg">{user.phone}</p>
            </div>

            {/* Address */}
            <div className="mb-8">
              <label className="text-[#54c07a] font-semibold text-sm block mb-2">
                <i className="fa-solid fa-location-dot mr-2"></i>Address
              </label>
              <p className="text-[#30ce67] text-lg">{user.address}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-[#1fb854]">
              <Link
                to="/user/profile/edit"
                className="flex-1 bg-[#1fb854] hover:bg-[#178a3f] text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-pen-to-square"></i>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
