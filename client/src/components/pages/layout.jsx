
import { Button } from "@/components/ui/button";
import {  Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useLocation, Link, Outlet } from 'react-router';

import skillswap from "@/assets/skillswap.svg";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
            <Button variant="outline" className="rounded-full">
              Sign In
            </Button>
            <Button className="rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <Outlet/>
      {/* Footer */}
      <footer className="bg-primary/5 mt-16">
        <div className="container px-4 mx-auto py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
              <span className="text-xl font-bold text-foreground">SkillSwap</span>
              <p className="text-sm text-muted-foreground">Empowering learners worldwide</p>
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 SkillSwap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
