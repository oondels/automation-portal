import { Link, useLocation } from "react-router-dom";
import {
  FolderKanban,
  Layout,
  FileSpreadsheet,
  ListPlus,
  Settings,
  X,
  Menu,
  LogOut,
  LogIn
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { useAuth } from "../../context/auth-context";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isMobile?: boolean;
}

export function Sidebar({ isMobile = false }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarVariants = {
    open: {
      width: isMobile ? "100%" : "240px",
      transition: { duration: 0.3 },
    },
    closed: {
      width: isMobile ? "0" : "80px",
      transition: { duration: 0.3 },
    },
  };

  const handleLoginOut = () => {
    if (user) {
      localStorage.removeItem('user');
      sessionStorage.clear();
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    }
    window.location.href = "/";
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Layout size={20} />,
      path: "/dashboard",
      onClick: () => isMobile && setIsOpen(false),
      disabled: false,
    },
    {
      title: "Projetos",
      icon: <FolderKanban size={20} />,
      path: "/projects",
      onClick: () => isMobile && setIsOpen(false),
      disabled: false,
    },
    {
      title: "Novo Projeto",
      icon: <ListPlus size={20} />,
      path: "/new-request",
      onClick: () => isMobile && setIsOpen(false),
      disabled: false,
    },
    {
      title: "Relatórios",
      icon: <FileSpreadsheet size={20} />,
      path: "/reports",
      onClick: () => isMobile && setIsOpen(false),
      disabled: true,
    },
    {
      title: "Configurações",
      icon: <Settings size={20} />,
      path: "/settings",
      onClick: () => isMobile && setIsOpen(false),
      disabled: true,
    },
    {
      title: user ? 'Sair' : "Entrar",
      icon: user ? <LogOut size={20} /> : <LogIn size={20} />,
      path: user ? "#" : "/login",
      onClick: handleLoginOut,
      disabled: false,
    },
  ];

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          <Menu size={24} />
        </Button>
      )}

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? "closed" : "open"}
            animate={isOpen ? "open" : "closed"}
            exit="closed"
            variants={sidebarVariants}
            className={cn(
              "fixed left-0 z-40 h-full border-r border-border bg-card text-card-foreground shadow-sm transition-all",
              isMobile && "top-0"
            )}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4">
                <Link to="/dashboard" className="flex items-center gap-2">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xl font-bold"
                    >
                      Dass Automação
                    </motion.span>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden sm:flex">
                      {isOpen ? <X size={18} /> : <Menu size={18} />}
                    </Button>
                  )}
                  {isMobile && (
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                      <X size={18} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-2 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={item.disabled ? (e) => e.preventDefault() : item.onClick}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/20 hover:text-accent-foreground",
                          item.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {item.icon}
                      {isOpen && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {item.title}
                        </motion.span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto border-t border-border p-4">
                {isOpen ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.nome} />
                        <AvatarFallback>{user?.nome?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.nome}</span>
                        <span className="text-xs text-muted-foreground">{user?.funcao}</span>
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.nome} />
                      <AvatarFallback>{user?.nome?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <ThemeToggle />
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
