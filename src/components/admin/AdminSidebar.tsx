
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
  ListChecks,
  Settings,
  Heart,
  DollarSign,
  TrendingUp
} from "lucide-react"

interface NavItem {
  name: string;
  icon: any;
  href: string;
}

interface Props {
  items: NavItem[]
}

function NavItemComponent({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
  const isActive = window.location.pathname === href;
  
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 group ${
        isActive 
          ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-glow transform scale-[1.02]" 
          : "text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-700/20 hover:shadow-lg hover:transform hover:scale-105"
      }`}
    >
      <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-white" : "text-red-400 group-hover:text-red-300"}`} />
      <span className="transition-colors">{children}</span>
    </a>
  )
}

export function AdminSidebar({ items }: Props) {
  return (
    <div className="w-64 bg-gradient-to-b from-black via-gray-900 to-black border-r border-gray-800 flex-col space-y-2 shadow-2xl">
      <div className="px-4 py-6">
        <div className="mb-8 px-2">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Administração
          </h2>
          <div className="h-0.5 bg-gradient-to-r from-red-500 to-transparent mt-2"></div>
        </div>
        
        <div className="space-y-2">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider px-2 mb-3">
              GERAL
            </h3>
            <NavItemComponent href="/admin/dashboard" icon={LayoutDashboard}>
              Dashboard
            </NavItemComponent>
            <NavItemComponent href="/admin/analytics" icon={BarChart}>
              Analytics
            </NavItemComponent>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider px-2 mb-3">
              GESTÃO
            </h3>
            <NavItemComponent href="/admin/artists" icon={Brush}>
              Tatuadores
            </NavItemComponent>
            <NavItemComponent href="/admin/clients" icon={Users}>
              Clientes
            </NavItemComponent>
            <NavItemComponent href="/admin/appointments" icon={Calendar}>
              Agendamentos
            </NavItemComponent>
            <NavItemComponent href="/admin/projects" icon={FolderKanban}>
              Projetos
            </NavItemComponent>
            <NavItemComponent href="/admin/loyalty" icon={Heart}>
              Fidelidade
            </NavItemComponent>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider px-2 mb-3">
              VENDAS & FINANCEIRO
            </h3>
            <NavItemComponent href="/admin/products" icon={ShoppingCart}>
              Produtos
            </NavItemComponent>
            <NavItemComponent href="/admin/stock" icon={ListChecks}>
              Estoque
            </NavItemComponent>
            <NavItemComponent href="/admin/financial" icon={DollarSign}>
              Financeiro
            </NavItemComponent>
            <NavItemComponent href="/admin/reports" icon={TrendingUp}>
              Relatórios
            </NavItemComponent>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider px-2 mb-3">
              CONFIGURAÇÕES
            </h3>
            <NavItemComponent href="/admin/events" icon={Calendar}>
              Eventos
            </NavItemComponent>
            <NavItemComponent href="/admin/blog" icon={FileText}>
              Blog
            </NavItemComponent>
            <NavItemComponent href="/admin/settings" icon={Settings}>
              Estúdio
            </NavItemComponent>
            <NavItemComponent href="/admin/security" icon={Lock}>
              Segurança
            </NavItemComponent>
          </div>
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
    name: "Analytics",
    icon: BarChart,
    href: "/admin/analytics",
  },
  {
    name: "Tatuadores",
    icon: Brush,
    href: "/admin/artists",
  },
  {
    name: "Clientes",
    icon: Users,
    href: "/admin/clients",
  },
  {
    name: "Agendamentos",
    icon: Calendar,
    href: "/admin/appointments",
  },
  {
    name: "Projetos",
    icon: FolderKanban,
    href: "/admin/projects",
  },
  {
    name: "Fidelidade",
    icon: Heart,
    href: "/admin/loyalty",
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
    icon: DollarSign,
    href: "/admin/financial",
  },
  {
    name: "Relatórios",
    icon: TrendingUp,
    href: "/admin/reports",
  },
  {
    name: "Eventos",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    name: "Blog",
    icon: FileText,
    href: "/admin/blog",
  },
  {
    name: "Estúdio",
    icon: Settings,
    href: "/admin/settings",
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
