"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSidebar } from "@/components/sidebar-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import {
  ClipboardList,
  FileText,
  Home,
  Leaf,
  LogOut,
  Menu,
  PackageOpen,
  Settings,
  Users,
  AlertTriangle,
  Briefcase,
  Camera,
  FileSpreadsheet,
} from "lucide-react"

interface SidebarProps {
  role: string
}

export function MainSidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen, toggle, isMobile } = useSidebar()
  const router = useRouter()
  const { dispatch } = useAppStore()

  // Manejar cierre de sesión
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    router.push("/login")
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        href: `/dashboard/${role}`,
        icon: Home,
      },
    ]

    const roleSpecificItems = {
      administrador: [
        {
          title: "Brigadas",
          href: "/brigadas",
          icon: Users,
        },
        {
          title: "Investigaciones",
          href: "/investigaciones",
          icon: FileText,
        },
        {
          title: "Usuarios",
          href: "/usuarios",
          icon: Users,
        },
        {
          title: "Reportes",
          href: "/reportes",
          icon: FileSpreadsheet,
        },
        {
          title: "Configuración",
          href: "/configuracion",
          icon: Settings,
        },
      ],
      jefe: [
        {
          title: "Tareas",
          href: "/tareas",
          icon: ClipboardList,
        },
        {
          title: "Novedades",
          href: "/novedades",
          icon: AlertTriangle,
        },
        {
          title: "Inventario",
          href: "/inventario",
          icon: PackageOpen,
        },
        {
          title: "Equipo",
          href: "/equipo",
          icon: Users,
        },
      ],
      auxiliar: [
        {
          title: "Registro Fotográfico",
          href: "/registro-fotografico",
          icon: Camera,
        },
        {
          title: "Inventario de Equipos",
          href: "/inventario-equipos",
          icon: PackageOpen,
        },
        {
          title: "Tareas Asignadas",
          href: "/tareas-asignadas",
          icon: ClipboardList,
        },
      ],
      botanico: [
        {
          title: "Tareas Asignadas",
          href: "/tareas-asignadas",
          icon: ClipboardList,
        },
        {
          title: "Colección de Muestras",
          href: "/coleccion-muestras",
          icon: Leaf,
        },
        {
          title: "Formularios de Recolección",
          href: "/formularios-recoleccion",
          icon: FileText,
        },
      ],
      coinvestigador: [
        {
          title: "Dashboard",
          href: "/dashboard/coinvestigador",
          icon: Home,
        },
        {
          title: "Tareas Asignadas",
          href: "/tareas-asignadas",
          icon: ClipboardList,
        },
        {
          title: "Investigaciones",
          href: "/investigaciones-coinvestigador",
          icon: Briefcase,
        },
        {
          title: "Progreso de Brigadas",
          href: "/progreso-brigadas",
          icon: Users,
        },
      ],
    }

    return [...commonItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])]
  }

  const navItems = getNavItems()

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href={`/dashboard/${role}`} className="flex items-center gap-2 font-semibold">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-lg">Inventario Forestal</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={toggle}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-green-100 text-green-900"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )

  // For mobile, use a Sheet component
  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40" onClick={toggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <Sheet open={isOpen} onOpenChange={toggle}>
          <SheetContent side="left" className="p-0 w-64">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // For desktop, use a regular sidebar
  return (
    <div
      className={cn("h-screen border-r bg-background transition-all duration-300 ease-in-out", isOpen ? "w-64" : "w-0")}
    >
      {isOpen && sidebarContent}
    </div>
  )
}
