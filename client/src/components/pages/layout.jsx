import { Button } from "@/components/ui/button";
import { Bell, Star, MessageSquare } from "lucide-react";
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
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
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
  const [unreadChats, setUnreadChats] = useState(0);

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

    const fetchUnreadChats = async () => {
      try {
        const response = await axiosInstance.get('/api/chat/conversations');
        const totalUnread = response.data.reduce((sum, user) => sum + user.unreadCount, 0);
        setUnreadChats(totalUnread);
      } catch (error) {
        console.error('Error fetching unread chats:', error);
      }
    };

    if (user) {
      fetchNotifications();
      fetchUnreadChats();
    }
  }, [user]);

  const handleNotificationRead = () => {
    setUnreadNotifications(prevCount => Math.max(0, prevCount - 1));
  };

  const handleChatClick = () => {
    setUnreadChats(0); // Mark all chats as read when navigating to chat
  };

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
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link to="/exchange-skills" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/exchange-skills" ? "text-primary" : ""}`}>
                      Exchange Skills
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {user.organization && ( // Only show if user is part of an organization
                  <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Link to="/member-workshops" className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ${location.pathname === "/member-workshops" ? "text-primary" : ""}`}>
                        View Workshops
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </>
            )}
            {user && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  Swap Requests
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-10">
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link to="/swap-request-form">Request Swap</Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link to="/swap-requests">My Swap Requests</Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link to="/sent-swap-requests">Sent Swap Requests</Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link to="/received-swap-requests">Received Swap Requests</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                    <Link to="/approved-swap-requests">Approved Swap Requests</Link>
                  </NavigationMenuLink>

                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
            {
              user && (
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link to={`/add-complaint/`}>
                      Add Complaint
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            }
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
                <Link to="/chat" onClick={handleChatClick}>
                  <MessageSquare />
                  {unreadChats > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {unreadChats}
                    </Badge>
                  )}
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <Bell />
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
