"use client"

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar"
import {
  IconArrowLeft,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
} from "@tabler/icons-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

// Hook to detect mobile for auto close
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return isMobile
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const links = [
    {
      label: "Add Transaction",
      href: "/dashboard/add",
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-muted-foreground" />,
    },
    {
      label: "All Transactions",
      href: "/dashboard/transactions",
      icon: <IconListDetails className="h-5 w-5 shrink-0 text-muted-foreground" />,
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
    {
      label: "Logout",
      href: "/logout",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground" />,
    },
  ]

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[100vw] flex-1 flex-col overflow-hidden md:flex-row",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (isMobile) setOpen(false)
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
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto px-4 py-6 md:px-6">
          {children}
        </div>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-foreground"
      >
        Acet Labs
      </motion.span>
    </a>
  )
}

function LogoIcon() {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
    </a>
  )
}
