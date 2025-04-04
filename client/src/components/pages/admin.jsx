import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  User,
  Users,
  PawPrint,
  FileText,
  Search,
  LogOut,
  Dog,
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
    title: "Adopter Management",
    url: "/admin/adopters",
    icon: User
  },
  {
    title: "Foster Management",
    url: "/admin/fosters",
    icon: Users
  },
  {
    title: "Rescue Management",
    url: "/admin/rescues",
    icon: Search
  },
  {
    title: "Pet Owner",
    url: "/admin/pet-owner",
    icon: User
  },
  {
    title: "Pet Management",
    url: "/admin/pet-management",
    icon: Dog
  },
  {
    title: "Lost & Found Pets",
    url: "/admin/lost-found-pets",
    icon: Search
  },
  {
    title: "Manage Applications",
    url: "/admin/manage-applications",
    icon: FileText
  },
  {
    title: "Adopted Pets",
    url: "/admin/adopted-pets",
    icon: PawPrint
  },
  {
    title: "Fostered Pets",
    url: "/admin/fostered-pets",
    icon: PawPrint
  },
  {
    title: "Manage Documents",
    url: "/admin/manage-documents",
    icon: FileText
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
        <main className="flex-1 px-6 pb-6">
          <div className="bg-white rounded-lg h-full p-6">
            {/* Dashboard content would go here */}
            <p className="text-gray-500 text-center mt-10">
              Select an option from the sidebar to get started
            </p>
          </div>
        </main>
      </div>
    </div>

    </SidebarProvider>
  );
}
