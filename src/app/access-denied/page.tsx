"use server";

import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { getUser } from "@/lib/auth";

const AccessDenied = async () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-background px-4">
      <Card className="w-full max-w-md rounded-md bg-app-card border border-app-border">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <AlertTriangle className="size-10 text-destructive" />
          </div>
          <CardTitle className="text-white">Acesso Negado</CardTitle>
          <CardDescription className="text-white">
            Você não tem permissão para acessar o painel administrativo
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          <p className="text-white">
            Este painel é restrito apenas para usuários com permissões de
            administrador.
          </p>
          <p className="mt-3 text-white">
            Caso acredite que isso seja um erro, por favor, consulte o
            responsável.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <form action={logoutAction}>
            <Button
              className="gap-2 bg-red-500 hover:bg-red-500 rounded-md"
              type="submit"
            >
              <LogOut className="size-4" />
              Sair da Conta
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessDenied;
