import Navbar from "../../components/common/Navbar.tsx";
import bg1 from "../../assets/bg/bg-1.jpg";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Us",
      details: "123 Fashion Street, Style City, SC 12345",
    },
    {
      icon: "📞",
      title: "Call Us",
      details: "+1 (555) 123-4567",
    },
    {
      icon: "✉️",
      title: "Email Us",
      details: "info@stitchcraft.com",
    },
    {
      icon: "⏰",
      title: "Working Hours",
      details: "Mon - Sat: 9:00 AM - 7:00 PM\nSunday: 11:00 AM - 5:00 PM",
    },
  ];

  const socialMedia = [
    {
      name: "Facebook",
      icon: "📘",
      url: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: "📷",
      url: "https://instagram.com",
      color: "hover:text-pink-500",
    },
    {
      name: "Twitter",
      icon: "𝕏",
      url: "https://twitter.com",
      color: "hover:text-gray-700",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      url: "https://linkedin.com",
      color: "hover:text-blue-700",
    },
    {
      name: "WhatsApp",
      icon: "💬",
      url: "https://wa.me/",
      color: "hover:text-green-500",
    },
    {
      name: "YouTube",
      icon: "🎥",
      url: "https://youtube.com",
      color: "hover:text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1b1717]">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(${bg1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-96 flex flex-col"
      >
        <Navbar />

        <div className="flex-1 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4">Get In Touch</h1>
          <p className="text-2xl">
            We'd love to hear from you. Let's create something beautiful
            together.
          </p>
        </div>
      </div>

      {/* Contact Information Cards */}
      <section className="py-20 px-4 bg-[#282424]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#54c07a]">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-[#1b1717] p-8 rounded-lg shadow-lg hover:shadow-xl transition text-center border-t-4 border-[#1fb854]"
              >
                <div className="text-5xl mb-4">{info.icon}</div>
                <h3 className="text-xl font-bold text-[#54c07a] mb-3">
                  {info.title}
                </h3>
                <p className="text-[#30ce67] whitespace-pre-line">
                  {info.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 px-4 bg-[#1b1717]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-4xl font-bold text-[#54c07a] mb-8">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-[#30ce67] font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border-2 border-[#1fb854] rounded-lg focus:outline-none focus:border-[#54c07a] transition bg-[#282424] text-[#30ce67] placeholder:text-[#30ce67]"
                  />
                </div>

                <div>
                  <label className="block text-[#30ce67] font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-[#1fb854] rounded-lg focus:outline-none focus:border-[#54c07a] transition bg-[#282424] text-[#30ce67] placeholder:text-[#30ce67]"
                  />
                </div>

                <div>
                  <label className="block text-[#30ce67] font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border-2 border-[#1fb854] rounded-lg focus:outline-none focus:border-[#54c07a] transition bg-[#282424] text-[#30ce67] placeholder:text-[#30ce67]"
                  />
                </div>

                <div>
                  <label className="block text-[#30ce67] font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border-2 border-[#1fb854] rounded-lg focus:outline-none focus:border-[#54c07a] transition bg-[#282424] text-[#30ce67] placeholder:text-[#30ce67]"
                  />
                </div>

                <div>
                  <label className="block text-[#30ce67] font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-[#1fb854] rounded-lg focus:outline-none focus:border-[#54c07a] transition bg-[#282424] text-[#30ce67] placeholder:text-[#30ce67]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1fb854] hover:bg-[#178a3f] text-white font-bold py-3 rounded-lg transition transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-4xl font-bold text-[#54c07a] mb-8">
                Find Us On Map
              </h2>
              <div className="rounded-lg overflow-hidden shadow-lg h-96 lg:h-full min-h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1890991023197!2d-74.00601!3d40.71278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a27d5d0d5b7%3A0x1f835db4d6b2d9a!2s123%20Fashion%20Street%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1625000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="Stitch Craft Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 px-4 bg-[#282424]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#54c07a] mb-4">
            Follow Us On Social Media
          </h2>
          <p className="text-[#30ce67] text-lg mb-12">
            Stay updated with our latest designs, trends, and exclusive offers
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className={`flex flex-col items-center p-6 bg-[#1b1717] rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-[#1fb854] ${social.color}`}
              >
                <div className="text-6xl mb-2">{social.icon}</div>
                <span className="text-[#30ce67] font-semibold">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-[#1b1717]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#54c07a] mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "How long does tailoring usually take?",
                answer:
                  "Custom tailoring typically takes 2-4 weeks depending on the complexity of the design and our current workload. Express services are available upon request.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, digital wallets, and cash. Online payments are secure and encrypted.",
              },
              {
                question: "Can I get alterations on clothes not made by you?",
                answer:
                  "Yes! We provide professional alteration services for garments from any brand or store. Just bring them in for a consultation.",
              },
              {
                question: "Do you offer consultations?",
                answer:
                  "Absolutely! We offer free initial consultations to discuss your vision, preferences, and budget. Book an appointment today.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-[#282424] p-8 rounded-lg border-l-4 border-[#1fb854]"
              >
                <h3 className="text-lg font-bold text-[#54c07a] mb-3">
                  {faq.question}
                </h3>
                <p className="text-[#30ce67]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#178a3f]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Schedule Your Consultation?
          </h2>
          <button className="bg-white text-[#178a3f] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-lg">
            Book Appointment Now
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-12 px-4 bg-[#1b1717] border-t-2 border-[#178a3f] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-[#54c07a]">
                Stitch Craft
              </h3>
              <p className="text-[#30ce67]">
                Premium tailoring and custom fashion for every occasion.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-[#54c07a]">
                Quick Links
              </h4>
              <ul className="text-[#30ce67] space-y-2">
                <li>
                  <a href="/" className="hover:text-[#54c07a]">
                    Home
                  </a>
                </li>
                {/* <li>
                  <a href="/about" className="hover:text-[#54c07a]">
                    About Us
                  </a>
                </li> */}
                <li>
                  <a href="/contact" className="hover:text-[#54c07a]">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#178a3f] pt-8 text-center text-[#30ce67]">
            <p>&copy; 2025 Stitch Craft. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
