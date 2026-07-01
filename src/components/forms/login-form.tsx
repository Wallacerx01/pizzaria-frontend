"use client";
import { useActionState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error, {
        className: "!bg-red-500 !text-white !border-red-500",
      });
    }
  }, [state?.error]);

  return (
    <Card className="bg-app-card border border-app-border rounded-sm w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-center text-xl sm:text-2xl">
          SUJEITO
          <span className="text-brand-primary">PIZZA</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu email..."
              required
              className="text-white bg-app-card border border-app-border rounded-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha..."
              required
              className="text-white bg-app-card border border-app-border rounded-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white rounded-sm hover:bg-brand-primary"
          >
            {isPending ? "Acessando conta..." : "Acessar"}
          </Button>

          <p className="text-gray-100 text-center">
            Ainda não possui uma conta?{" "}
            <Link href="/register" className="text-brand-primary font-semibold">
              Cadastre-se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
