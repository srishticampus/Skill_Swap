import { Button } from "@/components/ui/button";
import { useLocation, Link, Outlet } from 'react-router';
import { useAuth } from "@/context/AuthContext";
import skillswap from "@/assets/skillswap.svg";
import skillswapwhite from "@/assets/skillswap-white.svg";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";

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
              A platform for exchanging skills, real-time collaborations and progress tracking.
            </p>
          </div>
          <nav className="flex-1 flex justify-end gap-8">
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-[#E54C00] transition">
                Home
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
            &copy; 2025 Skill Swap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="container w-full flex items-baseline justify-between px-4 py-3 mx-auto">
      <div className="flex items-center justify-between w-full">
        <Link to="/">
          <img src={skillswap} alt="skillswap" className="mr-12 rounded-full" />
        </Link>
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center w-full">
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link to="/" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/" ? "text-primary" : ""}`}>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link to="/about" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/about" ? "text-primary" : ""}`}>
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link to="/contact" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/contact" ? "text-primary" : ""}`}>
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user && (
              <>
              </>
            )}
            {user?.isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link to="/admin" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/admin" ? "text-primary" : ""}`}>
                    Admin Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="outline" className="rounded-full" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
