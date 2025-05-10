import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useLocation, Link, Outlet } from 'react-router';
import { useAuth } from "@/context/AuthContext";
import skillswap from "@/assets/skillswap.svg";
import skillswapwhite from "@/assets/skillswap-white.svg";
import Notifications from "@/components/Notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
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
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/api/notifications');
        const unread = response.data.filter(notification => !notification.read).length;
        setUnreadNotifications(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleNotificationRead = () => {
    setUnreadNotifications(prevCount => Math.max(0, prevCount - 1));
  };

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
          {user && (
            <>
              <Link to="/exchange-skills" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/exchange-skills" ? "text-primary" : ""}`}>
                Exchange Skills
              </Link>
              <Link to="/swap-request-form" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/swap-request-form" ? "text-primary" : ""}`}>
                Request Swap
              </Link>
              <Link to="/swap-requests" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/swap-requests" ? "text-primary" : ""}`}>
                My Swap Requests
              </Link>
            </>
          )}
          {user?.isAdmin && (
            <Link to="/admin" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/admin" ? "text-primary" : ""}`}>
              Admin Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <Bell/>
                    {unreadNotifications > 0 && (
                      <Badge className="ml-2">{unreadNotifications}</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Notifications onNotificationRead={handleNotificationRead} />
                </DropdownMenuContent>
              </DropdownMenu>
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
    </nav>
  );
}

export default function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <Outlet/>
      <Footer />
    </div>
  );
}
