"use client";
import { cn } from "@/lib/utils";
import { ShoppingCart, Package, Tags, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { logoutAction } from "@/actions/auth";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  {
    title: "Pedidos",
    href: "/dashboard",
    icon: ShoppingCart,
  },
  {
    title: "Produtos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/dashboard/categories",
    icon: Tags,
  },
];

const MobileSidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathName = usePathname();
  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-50 border-b border-app-border bg-app-card">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-72 p-0 bg-app-sidebar border-app-border"
            >
              <SheetHeader className="border-b border-app-border p-6">
                <SheetTitle className="text-xl text-white font-bold">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col p-4 space-y-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathName === item.href;
                  return (
                    <Link
                      href={item.href}
                      key={item.title}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors duration-200 text-white",
                        isActive
                          ? "bg-brand-primary text-white"
                          : "hover:bg-gray-600",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>

              <footer className="absolute bottom-0 w-full border-t border-app-border p-4">
                <form action={logoutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white hover:text-white hover:bg-transparent"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </Button>
                </form>
              </footer>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-bold">
            Sujeito<span className="text-brand-primary">Pizza</span>
          </h1>

          <div className="w-10"></div>
        </div>
      </header>
    </div>
  );
};

export { MobileSidebar };
