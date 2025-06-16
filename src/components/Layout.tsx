import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { PenTool, Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  restrictHeight?: boolean;
}

export function Layout({
  children,
  onSearch,
  showSearch = false,
  restrictHeight = false,
}: LayoutProps) {
  const location = useLocation();

  return (
    <div
      className={`bg-background ${restrictHeight ? "h-screen flex flex-col overflow-hidden" : "min-h-screen"}`}
    >
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <PenTool className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Arpan's Blog</span>
            </Link>
          </div>

          {/* Center search bar */}
          {showSearch && onSearch && (
            <div className="flex-1 max-w-md mx-8">
              <SearchBar onSearch={onSearch} placeholder="Search posts..." />
            </div>
          )}

          <nav className="flex items-center space-x-4">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>

            <Button
              variant={
                location.pathname.startsWith("/admin") ? "default" : "ghost"
              }
              size="sm"
              asChild
            >
              <Link to="/admin">
                <PenTool className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>

            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className={restrictHeight ? "flex-1 overflow-hidden" : ""}>
        {children}
      </main>
    </div>
  );
}
