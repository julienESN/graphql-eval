/**
 * Layout principal de l'application
 * @file layout.tsx
 *
 * Ce composant définit la structure principale de l'application avec une sidebar
 * contenant le logo et les liens de navigation principaux, et un footer en bas de page.
 */

import { Outlet, NavLink } from 'react-router';
import { Home, PlusCircle, User, HandMetal } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import Footer from '@/components/Footer'; // Assurez-vous que le chemin est correct

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen">
        {/* Sidebar à gauche */}
        <Sidebar variant="floating" collapsible="icon">
          <SidebarHeader className="flex items-center justify-between py-6 px-2">
            <HandMetal />
            <SidebarTrigger />
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {/* Lien Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Accueil">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? 'text-primary' : ''
                    }
                  >
                    <Home className="h-4 w-4" />
                    <span>Accueil</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Lien Create */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Créer">
                  <NavLink
                    to="/create"
                    className={({ isActive }) =>
                      isActive ? 'text-primary' : ''
                    }
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Créer</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Lien Account */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Compte">
                  <NavLink
                    to="/account"
                    className={({ isActive }) =>
                      isActive ? 'text-primary' : ''
                    }
                  >
                    <User className="h-4 w-4" />
                    <span>Compte</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Conteneur principal à droite */}
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
