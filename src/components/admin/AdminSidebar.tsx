import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  ShoppingCart,
  BarChart,
  Lock,
  FolderKanban,
  Brush,
  ListChecks
} from "lucide-react"

import { NavItem } from "@/types"

interface Props {
  items: NavItem[]
}

export function AdminSidebar({ items }: Props) {
  return (
    <div className="w-64 border-r flex-col space-y-1">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Administração
        </h2>
        <div className="space-y-1">
          {items.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon}>
              {item.name}
            </NavItem>
          ))}
        </div>
      </div>
    </div>
  )
}

const sidebarItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    name: "Artistas",
    icon: Brush,
    href: "/admin/artists",
  },
  {
    name: "Agendamentos",
    icon: Calendar,
    href: "/admin/appointments",
  },
  {
    name: "Clientes",
    icon: Users,
    href: "/admin/clients",
  },
  {
    name: "Produtos",
    icon: ShoppingCart,
    href: "/admin/products",
  },
  {
    name: "Estoque",
    icon: ListChecks,
    href: "/admin/stock",
  },
  {
    name: "Financeiro",
    icon: FileText,
    href: "/admin/financial",
  },
  {
    name: "Analytics",
    icon: BarChart,
    href: "/admin/analytics",
  },
  {
    name: "Projetos",
    icon: FolderKanban,
    href: "/admin/projects",
  },
  {
    name: "Eventos",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    name: "Segurança",
    icon: Lock,
    href: "/admin/security",
  },
];

export default function Sidebar() {
  return (
    <AdminSidebar items={sidebarItems} />
  )
}
