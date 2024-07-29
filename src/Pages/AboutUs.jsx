import React from "react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import Navbar from "../Components/Navbar";

const AboutUs = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-8">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 text-gray-800 text-center">
            About Us
          </h1>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto text-center">
            Our platform boasts an extensive collection of reliable technology
            tools, many of which are associated with the IT industry; this
            facilitates the introduction of enterprises in need of a blog and
            social media app.
          </p>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700 text-center">
            What We Do
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto text-center">
            Our platform has been launched to provide users with an engaging
            experience. Our mission is to offer a seamless and user-friendly
            environment where creativity and communication can thrive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center transform transition duration-500 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg border-2 border-blue-300 animate-bounce">
                <span className="text-white text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Select
              </h3>
              <p className="text-gray-600">
                Select reputable tools and libraries to ensure the best
                development practices.
              </p>
            </div>
            <div className="text-center transform transition duration-500 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 shadow-lg border-2 border-green-300 animate-bounce">
                <span className="text-white text-2xl">👁</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Understand
              </h3>
              <p className="text-gray-600">
                Understand the users' needs to bridge the gaps and deliver a
                comprehensive solution.
              </p>
            </div>
            <div className="text-center transform transition duration-500 hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full mb-4 shadow-lg border-2 border-yellow-300 animate-bounce">
                <span className="text-white text-2xl">☀️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Innovate
              </h3>
              <p className="text-gray-600">
                Innovate continuously to provide new features and improvements.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">
              About the Developer
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Hello! I am Mamhoud Hussien, a trainee at ITI specializing in
              Front-end & Cross-platform Mobile Development. I have a passion
              for creating innovative web applications that are both functional
              and aesthetically pleasing. This project is a testament to my
              skills and dedication to continuous learning and improvement in
              the field of web development.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <a
                href="tel:+201026376434"
                className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg transition duration-300 hover:bg-blue-700"
              >
                +201026376434
              </a>
              <a
                href="tel:+201101071870"
                className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg transition duration-300 hover:bg-blue-700"
              >
                +201101071870
              </a>
            </div>
            <div className="flex justify-center gap-6">
              <a
                href="https://www.linkedin.com/in/mahmoud-hussien-481490243/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-3xl transition duration-300 hover:text-blue-800"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/mahmouudhussien1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 text-3xl transition duration-300 hover:text-pink-800"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
