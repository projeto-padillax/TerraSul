import {
  Home,
  ImageIcon,
  Presentation,
  TrendingUp,
  FileText,
  Users,
  BarChart3,
  Layout,
  Settings,
  UserCheck,
  Clock,
  PictureInPicture2Icon
} from "lucide-react"
import { AdminCard } from "./card"


export function AdminDashboard() {
  const siteManagementCards = [
    {
      title: "Seleção Especial de Imóveis",
      subtitle: "Gerencie as seleções especiais no sistema de administração",
      icon: Home,
      color: "bg-blue-500",
      href: "/admin/especiais",
    },
    {
      title: "Banners na Home",
      subtitle: "Configurar banners secundários",
      icon: ImageIcon,
      color: "bg-green-500",
      href: "/admin/banners",
    },
    {
      title: "Slides na Home",
      subtitle: "Gerenciar carrossel de imagens",
      icon: Presentation,
      color: "bg-purple-500",
      href: "/admin/slides",
    },
    {
      title: "Chamadas na Home",
      subtitle: "Gerencie as chamadas no sistema de administração",
      icon: PictureInPicture2Icon,
      color: "bg-orange-500",
      href: "/admin/chamadas",
    },
    {
      title: "Links mais acessados",
      subtitle: "Gerenciar imóveis em destaque",
      icon: TrendingUp,
      color: "bg-red-500",
      href: "/admin/links",
    },
    {
      title: "Páginas de Conteúdo",
      subtitle: "Sobre, contato, novidades",
      icon: FileText,
      color: "bg-indigo-500",
      href: "/admin/paginas",
    },
    {
      title: "Corretores",
      subtitle: "Gerenciar equipe de vendas",
      icon: Users,
      color: "bg-teal-500",
      href: "/admin/corretores",
    },
    {
      title: "Atualização de Imóveis",
      subtitle: "Atualizar imóveis por código",
      icon: Clock,
      color: "bg-pink-500",
      href: "/admin/imoveis",
    },
    {
      title: "Seções do Site e SEO",
      subtitle: "Configurar layout geral e performance",
      icon: Layout,
      color: "bg-cyan-500",
      href: "/admin/secoes",
    },
    {
      title: "Configurações do site",
      subtitle: "Configurações gerais",
      icon: Settings,
      color: "bg-gray-500",
      href: "/admin/config",
    },
  ]

  const formsCards = [
    {
      title: "Central de Leads",
      subtitle: "Gerenciar contatos recebidos",
      icon: BarChart3,
      color: "bg-blue-600",
      href: "/admin/leads",
    },
    // {
    //   title: "Histórico de Navegação",
    //   subtitle: "Analytics do site",
    //   icon: TrendingUp,
    //   color: "bg-teal-600",
    //   href: "/admin/historico",
    // },
    // {
    //   title: "Anuncie seu Imóvel",
    //   subtitle: "Gerenciar anúncios de imóveis",
    //   icon: House,
    //   color: "bg-green-600",
    //   href: "/admin/site/anuncie",
    // },
    // {
    //   title: "Formulário de Contato",
    //   subtitle: "Gerenciar página de contato",
    //   icon: Mail,
    //   color: "bg-purple-600",
    //   href: "/admin/site/contato",
    // },
    // {
    //   title: "Agendar Visita",
    //   subtitle: "Configurar agendamentos",
    //   icon: Calendar,
    //   color: "bg-orange-600",
    //   href: "/admin/site/visita",
    // },
    // {
    //   title: "Mais Informações",
    //   subtitle: "Formulários de interesse",
    //   icon: Info,
    //   color: "bg-red-600",
    //   href: "/admin/site/interessado",
    // },
    // {
    //   title: "Simular Financiamento",
    //   subtitle: "Calculadora de financiamento",
    //   icon: DollarSign,
    //   color: "bg-indigo-600",
    //   href: "/admin/site/financiamento",
    // },
    // {
    //   title: "WhatsApp",
    //   subtitle: "Configurar integração",
    //   icon: Phone,
    //   color: "bg-green-500",
    //   href: "/admin/site/whatsapp",
    // },
  ]

  const controlPanelCards = [
    {
      title: "Usuários do Painel",
      subtitle: "Gerenciar administradores",
      icon: UserCheck,
      color: "bg-gray-600",
      href: "/admin/usuarios",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Gestão do Site */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gestão do Site</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {siteManagementCards.map((card, index) => (
            <AdminCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Formulários do Site */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Formulários do Site</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formsCards.map((card, index) => (
            <AdminCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Painel de Controle */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Painel de Controle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {controlPanelCards.map((card, index) => (
            <AdminCard key={index} {...card} />
          ))}
        </div>
      </section>
    </div>
  )
}
