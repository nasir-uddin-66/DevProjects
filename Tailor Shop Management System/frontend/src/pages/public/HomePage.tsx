import Navbar from "../../components/common/Navbar.tsx";
import { useTheme } from "../../contexts/ThemeContext";
import bg1 from "../../assets/bg/bg-1.jpg";
import blouse from "../../assets/dresses/blouse.png";
import borkha from "../../assets/dresses/borkha.png";
import gown from "../../assets/dresses/gown.png";
import kurta from "../../assets/dresses/kurta.jpg";
import lehenga from "../../assets/dresses/lehenga.jpg";
import punjabi from "../../assets/dresses/punjabi.png";
import salwarkameej from "../../assets/dresses/salwarkameej.jpg";
import shirt from "../../assets/dresses/shirt.jpg";

export default function HomePage() {
  const { theme } = useTheme();
  const dresses = [
    {
      name: "Blouse",
      image: blouse,
      description: "Classic and elegant blouses",
    },
    {
      name: "Borkha",
      image: borkha,
      description: "Traditional borkha designs",
    },
    { name: "Gown", image: gown, description: "Stunning evening gowns" },
    {
      name: "Kurta",
      image: kurta,
      description: "Traditional kurtas for all occasions",
    },
    { name: "Lehenga", image: lehenga, description: "Beautiful lehenga sets" },
    {
      name: "Punjabi",
      image: punjabi,
      description: "Comfortable punjabi outfits",
    },
    {
      name: "Salwar Kameej",
      image: salwarkameej,
      description: "Timeless salwar kameej designs",
    },
    { name: "Shirt", image: shirt, description: "Tailored formal shirts" },
  ];

  const services = [
    {
      title: "Custom Tailoring",
      description:
        "Bespoke tailoring services tailored to your exact measurements and preferences",
    },
    {
      title: "Alterations",
      description: "Expert alterations and modifications to ensure perfect fit",
    },
    {
      title: "Embroidery & Design",
      description: "Beautiful embroidery work and custom design elements",
    },
    {
      title: "Fabric Selection",
      description: "Premium fabric selection assistance from trusted suppliers",
    },
  ];

  const testimonials = [
    {
      name: "Fatima Khan",
      text: "Stitch Craft created the most beautiful wedding dress I've ever seen. Their attention to detail is incredible!",
      rating: 5,
    },
    {
      name: "Zainab Ali",
      text: "The tailoring work is impeccable. Every stitch is perfect. Highly recommended!",
      rating: 5,
    },
    {
      name: "Amina Hassan",
      text: "Great service and excellent quality. Will definitely come back for more.",
      rating: 5,
    },
  ];

  return (
    <div className={theme === "light" ? "light-theme" : ""}>
      <div
        className={`min-h-screen ${
          theme === "light" ? "bg-white" : "bg-[#1b1717]"
        }`}
      >
        {/* Hero Section */}
        <div
          style={{
            backgroundImage: `linear-gradient(${
              theme === "light"
                ? "rgba(255, 255, 255, 0.2),rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)"
            }), url(${bg1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter:
              theme === "light"
                ? "brightness(1.2) contrast(1.1)"
                : "brightness(1) contrast(1)",
          }}
          className="h-screen flex flex-col"
        >
          <Navbar />

          <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
            <h1
              className={`text-6xl font-bold mb-4 ${theme === "light" ? "text-black" : "text-white"}`}
              style={{
                textShadow:
                  theme === "light"
                    ? "0 2px 8px rgba(255, 255, 255, 1)"
                    : "0 2px 8px rgba(0, 0, 0, 0.8)",
              }}
            >
              Stitch Craft
            </h1>
            <p
              className={`text-2xl mb-8 ${theme === "light" ? "text-black" : "text-white"}`}
              style={{
                textShadow:
                  theme === "light"
                    ? "0 2px 6px rgba(255, 255, 255, 1)"
                    : "0 2px 6px rgba(0, 0, 0, 0.7)",
              }}
            >
              Premium Tailoring & Custom Fashion
            </p>
            <p
              className={`text-lg max-w-2xl mb-12 ${theme === "light" ? "text-black" : "text-white"}`}
              style={{
                textShadow:
                  theme === "light"
                    ? "0 2px 4px rgba(255, 255, 255, 1)"
                    : "0 2px 4px rgba(0, 0, 0, 0.6)",
              }}
            >
              Crafting elegant and personalized garments for every occasion.
              Excellence in every stitch.
            </p>
            <a href="#our-collections">
              <button className="bg-[#1fb854] hover:bg-[#178a3f] text-white px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg">
                Explore Our Collections
              </button>
            </a>
          </div>
        </div>

        {/* Featured Collections Section */}
        <section
          className={`py-20 px-4 ${
            theme === "light" ? "bg-gray-100" : "bg-[#282424]"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-5xl font-bold text-center mb-4 ${
                theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
              }`}
              id="our-collections"
            >
              Our Collections
            </h2>
            <p
              className={`text-center ${
                theme === "light" ? "text-[#333]" : "text-[#30ce67]"
              } mb-16 text-lg`}
            >
              Explore our diverse range of expertly tailored garments
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {dresses.map((dress, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition border ${
                    theme === "light"
                      ? "bg-white border-[#1fb854]"
                      : "bg-[#1b1717] border-[#1fb854]"
                  }`}
                >
                  <div className="h-64 overflow-hidden bg-[#2a2424]">
                    <img
                      src={dress.image}
                      alt={dress.name}
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3
                      className={`text-xl font-bold ${
                        theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                      } mb-2`}
                    >
                      {dress.name}
                    </h3>
                    <p
                      className={
                        theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                      }
                    >
                      {dress.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          className={`py-20 px-4 ${
            theme === "light" ? "bg-white" : "bg-[#1b1717]"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-5xl font-bold text-center mb-4 ${
                theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
              }`}
            >
              Our Services
            </h2>
            <p
              className={`text-center ${
                theme === "light" ? "text-[#333]" : "text-[#30ce67]"
              } mb-16 text-lg`}
            >
              Comprehensive tailoring services to meet all your fashion needs
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-lg ${
                    theme === "light"
                      ? "bg-gray-100 border-l-4 border-[#1fb854]"
                      : "bg-[#282424] border-l-4 border-[#1fb854]"
                  } hover:shadow-lg transition`}
                >
                  <h3
                    className={`text-2xl font-bold ${
                      theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                    } mb-4`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-lg ${
                      theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section
          className={`py-20 px-4 ${
            theme === "light" ? "bg-gray-100" : "bg-[#282424]"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h2
              className={`text-5xl font-bold text-center mb-4 ${
                theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
              }`}
            >
              Why Choose Stitch Craft?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#1fb854] mb-4">
                  10+
                </div>
                <h3
                  className={`text-xl font-bold ${
                    theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                  } mb-2`}
                >
                  Years of Experience
                </h3>
                <p
                  className={
                    theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                  }
                >
                  Decades of mastering the craft of tailoring
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#1fb854] mb-4">
                  1000+
                </div>
                <h3
                  className={`text-xl font-bold ${
                    theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                  } mb-2`}
                >
                  Happy Customers
                </h3>
                <p
                  className={
                    theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                  }
                >
                  Trusted by thousands of satisfied clients
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#1fb854] mb-4">
                  100%
                </div>
                <h3
                  className={`text-xl font-bold ${
                    theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                  } mb-2`}
                >
                  Quality Guaranteed
                </h3>
                <p
                  className={
                    theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                  }
                >
                  Premium fabrics and impeccable craftsmanship
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          className={`py-20 px-4 ${
            theme === "light" ? "bg-white" : "bg-[#1b1717]"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-5xl font-bold text-center mb-4 ${
                theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
              }`}
            >
              Customer Reviews
            </h2>
            <p
              className={`text-center ${
                theme === "light" ? "text-[#333]" : "text-[#30ce67]"
              } mb-16 text-lg`}
            >
              What our satisfied customers are saying about Stitch Craft
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-lg shadow-lg hover:shadow-xl transition border border-[#1fb854] ${
                    theme === "light" ? "bg-gray-50" : "bg-[#282424]"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#1fb854] text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    className={`mb-6 italic text-lg ${
                      theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                    }`}
                  >
                    "{testimonial.text}"
                  </p>
                  <p
                    className={`font-bold ${
                      theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                    }`}
                  >
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 bg-[#178a3f]">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Create Your Perfect Garment?
            </h2>
            <p className="text-xl mb-8">
              Contact us today to schedule a consultation with our expert
              tailors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#178a3f] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                Book Appointment
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0f6530] transition">
                Contact Us
              </button>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section
          className={`py-12 px-4 ${
            theme === "light"
              ? "bg-gray-100 border-t-2 border-[#1fb854]"
              : "bg-[#1b1717] border-t-2 border-[#178a3f]"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                  }`}
                >
                  Stitch Craft
                </h3>
                <p
                  className={
                    theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                  }
                >
                  Premium tailoring and custom fashion for every occasion.
                </p>
              </div>
              <div>
                <h4
                  className={`text-lg font-bold mb-4 ${
                    theme === "light" ? "text-[#178a3f]" : "text-[#54c07a]"
                  }`}
                >
                  Quick Links
                </h4>
                <ul
                  className={`${
                    theme === "light" ? "text-[#333]" : "text-[#30ce67]"
                  } space-y-2`}
                >
                  <li>
                    {/* <a
                      href="/about"
                      className={
                        theme === "light"
                          ? "hover:text-[#178a3f]"
                          : "hover:text-[#54c07a]"
                      }
                    >
                      About Us
                    </a> */}
                  </li>
                  <li>
                    <a
                      href="/"
                      className={
                        theme === "light"
                          ? "hover:text-[#178a3f]"
                          : "hover:text-[#54c07a]"
                      }
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className={
                        theme === "light"
                          ? "hover:text-[#178a3f]"
                          : "hover:text-[#54c07a]"
                      }
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`border-t ${
                theme === "light" ? "border-[#1fb854]" : "border-[#178a3f]"
              } pt-8 text-center ${
                theme === "light" ? "text-[#333]" : "text-[#30ce67]"
              }`}
            >
              <p>&copy; 2025 Stitch Craft. All rights reserved.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
