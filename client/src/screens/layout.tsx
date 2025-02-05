/**
 * Layout principal de l'application
 * @file layout.tsx
 *
 * Ce composant définit la structure principale de l'application avec une sidebar
 * contenant uniquement les icônes de navigation avec leurs tooltips.
 */

import {Outlet} from "react-router";
import {NavLink} from "react-router";
import {Home, PlusCircle, User, LogOut, HandMetal} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/context/AuthContext.tsx";

/**
 * Composant Layout principal
 * Définit la structure de base avec une sidebar fixe en mode icônes
 */
export default function Layout() {
  const {logout} = useAuth()

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader className="flex items-center justify-center py-6">
            <HandMetal className="h-6 w-6"/>
          </SidebarHeader>

          <SidebarContent className="flex items-center justify-center py-6">
            <SidebarMenu className="gap-4">
              {/* Lien Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Accueil"
                  className="justify-center h-12"
                >
                  <NavLink
                    to="/"
                    className={({isActive}) =>
                      `flex justify-center ${isActive ? "text-primary" : ""}`
                    }
                  >
                    <Home className="h-6 w-6"/>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Lien Create */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Créer"
                  className="justify-center h-12"
                >
                  <NavLink
                    to="/create"
                    className={({isActive}) =>
                      `flex justify-center ${isActive ? "text-primary" : ""}`
                    }
                  >
                    <PlusCircle className="h-6 w-6"/>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="flex items-center justify-center py-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-12 w-12 items-center justify-center rounded-md hover:bg-accent">
                  <User className="h-5 w-5"/>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <NavLink to="/user" className="flex items-center gap-2">
                    <User className="h-5 w-5"/>
                    <span>Mon Compte</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="flex items-center gap-2 text-destructive" onClick={() => {
                  logout()
                }
                }>
                  <LogOut className="h-5 w-5"/>
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Contenu principal */}
        <main className="absolute inset-0 z-0 overflow-auto">
          <Outlet/>
        </main>
      </div>
    </SidebarProvider>
  );
}