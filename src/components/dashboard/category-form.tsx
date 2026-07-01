"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createCategoryAction } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CategoryForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = await createCategoryAction(formData);

    if (result.success) {
      router.refresh();
      toast.success("Categoria adicionada com sucesso!");
      setOpen(false);
      return;
    } else {
      toast.error("Falha ao criar categoria", {
        className: "!bg-red-500 !text-white !border-red-500",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-primary hover:bg-brand-primary rounded-md font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Nova categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 bg-app-card text-white border rounded-md">
        <DialogHeader>
          <DialogTitle>Criar nova categoria</DialogTitle>
          <DialogDescription>Criando nova categoria...</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreateCategory}>
          <div>
            <Label htmlFor="category" className="mb-2">
              Nome da categoria
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Digite o nome da categoria"
              className="border border-app-border bg-app-background text-white rounded-md"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary rounded-md"
          >
            Criar categoria
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CategoryForm };
