
import { Button } from "@/components/ui/button";
import {  Facebook, Twitter, Linkedin, Instagram,Dog } from "lucide-react";
import { useLocation, Link, Outlet } from 'react-router';

import skillswap from "@/assets/skillswap.svg";
import skillswapwhite from "@/assets/skillswap-white.svg";


const Footer = () => {
  return (
    <footer className="bg-[#4c4c4c] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={skillswapwhite} alt="skillswap" className="my-5 rounded-full" />

            </div>
            <p className="text-sm opacity-75">
              A compassionate platform dedicated to rescuing, rehabilitating,
              and rehoming pets.
            </p>
          </div>
          <nav className="flex-1 flex justify-end gap-8">
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-[#E54C00] transition">
                Home
              </Link>
              <Link to="/shop" className="hover:text-[#E54C00] transition">
                Shop
              </Link>
              <Link to="/about" className="hover:text-[#E54C00] transition">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#E54C00] transition">
                Contact
              </Link>
            </div>
          </nav>
        </div>
        <div className="border-t border-white/20 mt-8 pt-4 text-center md:text-left">
          <p className="text-sm opacity-75">
            &copy; 2025 PetConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <img src={skillswap} alt="skillswap" className="my-5 rounded-full" />

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/" ? "text-primary" : ""}`}>
            Home
          </Link>
          <Link to="/about" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/about" ? "text-primary" : ""}`}>
            About
          </Link>
          <Link to="/contact" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/contact" ? "text-primary" : ""}`}>
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default function Layout() {

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <Outlet/>
      <Footer />
    </div>
  );
}
