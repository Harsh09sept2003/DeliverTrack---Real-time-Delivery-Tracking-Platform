"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  Store,
  Truck,
  Users,
  Bell,
  Search,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "vendor" | "partner" | "customer";
  userName?: string;
}

export function DashboardLayout({ children, role, userName = "User" }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
  
  const getNavItems = (): NavItem[] => {
    const baseItems = [
      {
        title: "Dashboard",
        href: `/${role}/dashboard`,
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: "Profile",
        href: `/${role}/profile`,
        icon: <UserCircle className="h-5 w-5" />,
      },
    ];
    
    if (role === "vendor") {
      return [
        ...baseItems,
        {
          title: "Orders",
          href: `/${role}/orders`,
          icon: <Package className="h-5 w-5" />,
        },
        {
          title: "Partners",
          href: `/${role}/partners`,
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Settings",
          href: `/${role}/settings`,
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    } else if (role === "partner") {
      return [
        ...baseItems,
        {
          title: "Active Orders",
          href: `/${role}/orders`,
          icon: <Package className="h-5 w-5" />,
        },
        {
          title: "Location",
          href: `/${role}/location`,
          icon: <MapPin className="h-5 w-5" />,
        },
        {
          title: "Settings",
          href: `/${role}/settings`,
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          title: "My Orders",
          href: `/${role}/orders`,
          icon: <Package className="h-5 w-5" />,
        },
        {
          title: "Track",
          href: `/${role}/track`,
          icon: <MapPin className="h-5 w-5" />,
        },
        {
          title: "Settings",
          href: `/${role}/settings`,
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    }
  };
  
  const navItems = getNavItems();
  
  const getRoleIcon = () => {
    if (role === "vendor") return <Store className="h-6 w-6" />;
    if (role === "partner") return <Truck className="h-6 w-6" />;
    return <UserCircle className="h-6 w-6" />;
  };
  
  const getRoleLabel = () => {
    if (role === "vendor") return "Vendor";
    if (role === "partner") return "Delivery Partner";
    return "Customer";
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed left-0 top-0 bottom-0 border-r bg-card z-30">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-lg">DeliverTrack</span>
          </Link>
        </div>
        
        <div className="flex flex-col flex-1 px-4 py-6">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
          
          <div className="mt-auto space-y-4">
            <ModeToggle />
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-16 items-center gap-2 px-6 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-lg">DeliverTrack</span>
            </Link>
          </div>
          
          <div className="flex flex-col flex-1 px-4 py-6">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
            
            <div className="mt-auto space-y-4">
              <ModeToggle />
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/" onClick={() => setOpen(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <div className="flex-1 min-h-screen lg:ml-72">
        <header className={cn(
          "sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          scrolled && "shadow-sm"
        )}>
          <div className="lg:hidden">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
          </div>
          
          <div className="flex-1 flex items-center gap-4 lg:gap-8">
            <div className="flex-1 hidden lg:block">
              <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 bg-muted/50"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{getRoleLabel()}</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}