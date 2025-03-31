import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Install: npm install lucide-react

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    "Home",
    "Rentals",
    "Real Estate Sales",
    "About Us",
    "Blog",
    "Guest Reviews",
    "Guest Login",
    "Contact",
  ];

  return (
    <nav className="bg-sky-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-xl font-logo flex items-center space-x-2">
          <img
            src="/logo.png" // Replace with actual logo
            alt="Logo"
            className="h-8"
          />
          <span className="hidden sm:inline">Greta's Beach Rentals</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase().replace(/ /g, "-")}`}
              className="hover:text-teal-300 text-sm uppercase"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right side - Phone & User Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <a href="tel:8505585518" className="hover:text-teal-300">
            📞 (850) 558-5518
          </a>
          <a href="/rentals" className="hover:text-teal-300">
            ❤️ My Rentals
          </a>
          <a href="/recent" className="hover:text-teal-300">
            👁️ Recently Viewed (0)
          </a>
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-sky-800 px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase().replace(/ /g, "-")}`}
              className="block text-sm uppercase py-1 border-b border-sky-700"
            >
              {link}
            </a>
          ))}
          <div className="pt-2 text-sm space-y-1">
            <a href="tel:8505585518" className="block">
              📞 (850) 558-5518
            </a>
            <a href="/rentals" className="block">
              ❤️ My Rentals
            </a>
            <a href="/recent" className="block">
              👁️ Recently Viewed (0)
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
