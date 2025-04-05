import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  User,
  Users,
  PawPrint,
  FileText,
  Search,
  LogOut,
  Dog,
  Building2,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,

} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import skillswap from "@/assets/skillswap.svg";

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Organizations",
    url: "/admin/organizations",
    icon: Building2
  },
  {
    title: "Skill Swappers",
    url: "/admin/skill-swappers",
    icon: Users
  },
  {
    title: "Manage Categories",
    url: "/admin/categories",
    icon: Search
  },
  {
    title: "Manage Complaints",
    url: "/admin/complaints",
    icon: User
  },
];


function AppSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar className="border-none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="p-4 flex justify-center items-center gap-2 my-4">
            <img src={skillswap} alt="skillswap" className="my-5 rounded-full" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 py-1 space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="md"
                    asChild
                    className="hover:bg-[#F8F6FF]"
                    isActive={item.url === pathname}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center w-full px-4 text-gray-700  rounded-md transition-colors"
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function Admin() {
  return (
    <SidebarProvider>
    <div className="flex h-screen w-full bg-[#F6F7F9]">
      <AppSidebar />

      {/* Main Content Area */}
      <div className=" flex flex-col w-full">
        {/* Header */}
        <header className="flex justify-between items-center p-4 m-6 bg-white rounded-lg">
          <div className="flex items-center gap-4">
            <SidebarTrigger size="32" />
            <h1 className="text-xl text-secondary-foreground">Dashboard</h1>
          </div>
          <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center text-gray-700 hover:text-gray-900">
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
                <hr/>

                <DialogDescription>
                  Are you sure you want to log out ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex sm:justify-center">
                <Button type="submit" variant="outline" className="w-28" onClick={()=>{}}>Yes</Button>
                <DialogClose asChild>
                  <Button className="w-28">No</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </header>

        {/* Content */}
        <Outlet/>
      </div>
    </div>

    </SidebarProvider>
  );
}
