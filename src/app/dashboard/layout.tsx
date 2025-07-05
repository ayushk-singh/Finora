"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconPlus,
  IconChartBar,
  IconHelp,
  IconListDetails,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const links = [
    {
      label: "Add Transaction",
      href: "/dashboard/add",
      icon: <IconPlus className="h-5 w-5 shrink-0 text-muted-foreground" />,
    },
    {
      label: "All Transactions",
      href: "/dashboard/transactions",
      icon: (
        <IconListDetails className="h-5 w-5 shrink-0 text-muted-foreground" />
      ),
    },
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-muted-foreground" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-muted-foreground" />,
    },
    {
      label: "Help",
      href: "/dashboard/help",
      icon: <IconHelp className="h-5 w-5 shrink-0 text-muted-foreground" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full",
        isMobile ? "flex-col min-h-screen" : "h-screen overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10 h-full">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (isMobile) setOpen(false);
                  }}
                >
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isMobile ? "min-h-0" : "overflow-hidden"
        )}
      >
        <div
          className={cn(
            "flex-1 px-4 py-6 md:px-6",
            isMobile ? "pb-safe" : "overflow-y-auto"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <Image src="/logo.png" alt="logo" width="100" height="100" />
    </a>
  );
}

function LogoIcon() {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <Image src="/logo.png" alt="logo" width="100" height="100" />
    </a>
  );
}
