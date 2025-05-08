"use client"

import type { ReactNode } from "react"
import { MainSidebar } from "@/components/main-sidebar"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  role: string
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { isOpen, isMobile } = useSidebar()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <MainSidebar role={role} />
      <main
        className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
          isMobile ? "w-full" : isOpen ? "ml-64" : "ml-0",
        )}
      >
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
