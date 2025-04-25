"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Building2, Users, UserCog, ImageIcon, LogOut, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const routes = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/",
    color: "text-[#FFD000]",
  },
  {
    label: "Branches",
    icon: Building2,
    href: "/branches",
    color: "text-[#FFD000]",
  },
  {
    label: "Services",
    icon: Droplets,
    href: "/services",
    color: "text-[#FFD000]",
  },
  {
    label: "Supervisors",
    icon: UserCog,
    href: "/admins",
    color: "text-[#FFD000]",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/users",
    color: "text-[#FFD000]",
  },
  {
    label: "Advertisements",
    icon: ImageIcon,
    href: "/advertisements",
    color: "text-[#FFD000]",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-screen bg-white border-r border-gray-200 sticky top-0 left-0">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-10">
          <h1 className="text-xl font-bold">
            <span className="text-[#FFD000]">Niceday</span> Carwash
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-gray-100 rounded-lg transition",
                pathname === route.href ? "text-black bg-gray-100" : "text-gray-500",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-black hover:bg-gray-100">
          <LogOut className="h-5 w-5 mr-3 text-[#FFD000]" />
          Logout
        </Button>
      </div>
    </div>
  )
}
