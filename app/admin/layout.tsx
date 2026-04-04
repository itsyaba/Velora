"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard,
  Users,
  MapPin,
  CalendarCheck,
  Languages,
  Car,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

/* ------------------------------------------------------------------ */
/*  Nav configuration                                                  */
/* ------------------------------------------------------------------ */
const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Providers", href: "/admin/providers", icon: Users },
  { label: "Places", href: "/admin/places", icon: MapPin },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Translators", href: "/admin/translators", icon: Languages },
  { label: "Drivers", href: "/admin/drivers", icon: Car },
];

function getPageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  const match = navItems.find(
    (item) => item.href !== "/admin" && pathname.startsWith(item.href)
  );
  return match?.label ?? "Admin";
}

/* ------------------------------------------------------------------ */
/*  Sidebar nav link                                                   */
/* ------------------------------------------------------------------ */
function NavLink({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[number];
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        collapsed && "justify-center px-2.5",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {/* Active indicator glow */}
      {isActive && (
        <motion.div
          layoutId="admin-nav-active"
          className="absolute inset-0 rounded-xl bg-primary"
          style={{ zIndex: -1 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <Icon className={cn("size-[18px] shrink-0", isActive && "text-primary-foreground")} />
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap"
        >
          {item.label}
        </motion.span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

/* ------------------------------------------------------------------ */
/*  Desktop sidebar                                                    */
/* ------------------------------------------------------------------ */
function DesktopSidebar({
  collapsed,
  setCollapsed,
  pathname,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  pathname: string;
}) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-card lg:flex"
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-border px-4",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
          <Sparkles className="size-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold tracking-tight">Velora</span>
              <span className="text-[11px] text-muted-foreground">
                Admin Panel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive}
                collapsed={collapsed}
              />
            );
          })}
        </TooltipProvider>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center gap-2 text-muted-foreground hover:text-foreground",
            !collapsed && "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile sidebar (Sheet)                                             */
/* ------------------------------------------------------------------ */
function MobileSidebar({
  open,
  setOpen,
  pathname,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  pathname: string;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Sparkles className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="text-sm font-bold tracking-tight">
                Velora
              </SheetTitle>
              <SheetDescription className="text-[11px] text-muted-foreground">
                Admin Panel
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive}
                collapsed={false}
                onClick={() => setOpen(false)}
              />
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/*  Top navbar                                                         */
/* ------------------------------------------------------------------ */
function TopNavbar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear lg:px-6">
      <div className="flex w-full items-center gap-2">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </Button>

        {/* Sidebar Trigger Replica (for desktop visually) */}
        <div className="hidden items-center gap-2 lg:flex">
           <button className="flex size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
             <Menu className="size-3.5" />
           </button>
           <Separator orientation="vertical" className="h-4" />
        </div>

        {/* Breadcrumb style title */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="hidden text-muted-foreground md:inline">Velora</span>
          <span className="hidden text-muted-foreground md:inline">/</span>
          <span>{title}</span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="size-7 border border-border">
              <AvatarImage src="https://api.dicebear.com/9.x/avataaars/svg?seed=admin" />
              <AvatarFallback className="bg-muted text-[10px] font-semibold">
                AD
              </AvatarFallback>
            </Avatar>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Sign out"
                >
                  <LogOut className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Admin layout                                                       */
/* ------------------------------------------------------------------ */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  return (
    <>
    <TooltipProvider>
      <div className="relative min-h-screen bg-background">
        {/* Desktop sidebar */}
        <DesktopSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          pathname={pathname}
        />

        {/* Mobile sidebar */}
        <MobileSidebar
          open={mobileOpen}
          setOpen={setMobileOpen}
          pathname={pathname}
        />

        {/* Main content area */}
        <div
          className="flex min-h-screen flex-col transition-[margin-left] duration-300 ease-in-out"
          style={{
            marginLeft: isMobile ? 0 : collapsed ? "72px" : "260px",
          }}
        >
          <div className="flex min-h-screen flex-col">
            <TopNavbar
              title={pageTitle}
              onMenuClick={() => setMobileOpen(true)}
            />

            {/* Page content */}
            <main className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-1 flex-col gap-4"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
    <Toaster richColors={true} position="top-right" />
    </>
  );
}
