"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Category } from "@/lib/types";
import { toast } from "sonner";

interface ProductFormProps {
  categories: Category[];
}

const ProductForm = ({ categories }: ProductFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceValue, setPriceValue] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const convertBRLToCents = (value: string): number => {
    const cleanValue = value
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    const reais = parseFloat(cleanValue) || 0;

    return Math.round(reais * 100);
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      setLoading(false);
      return;
    }

    if (!selectedCategory) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    const formElement = e.currentTarget;

    const name = (formElement.elements.namedItem("name") as HTMLInputElement)
      ?.value;
    const description = (
      formElement.elements.namedItem("description") as HTMLInputElement
    )?.value;
    const priceInCents = convertBRLToCents(priceValue);

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", priceInCents.toString());
    formData.append("category_id", selectedCategory);
    formData.append("file", imageFile);

    const result = await createProductAction(formData);

    if (result.success) {
      router.refresh();
      toast.success("Produto adicionado com sucesso!");
      setOpen(false);
      setSelectedCategory("");
      setLoading(false);
      return;
    } else {
      toast.error("Falha ao criar produto", {
        className: "!bg-red-500 !text-white !border-red-500",
      });
      setLoading(false);
    }
  };

  const formatToBrl = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    const amount = parseInt(numbers) / 100;

    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatToBrl(e.target.value);
    setPriceValue(formatted);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) return;

      setImageFile(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-primary hover:bg-brand-primary rounded-md font-semibold">
          <Plus className="w-5 h-5 mr-2" />
          Novo produto
        </Button>
      </DialogTrigger>
      <DialogContent className="p-6 bg-app-card text-white border rounded-md max-w-md">
        <DialogHeader>
          <DialogTitle>Criar novo produto</DialogTitle>
          <DialogDescription>Criando novo produto...</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreateProduct}>
          <div>
            <Label htmlFor="name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Digite o nome do produto"
              className="border border-app-border bg-app-background text-white rounded-md"
            />
          </div>

          <div>
            <Label htmlFor="price" className="mb-2">
              Preço
            </Label>
            <Input
              id="price"
              name="price"
              required
              placeholder="Ex: R$ 35,00"
              className="border border-app-border bg-app-background text-white rounded-md"
              value={priceValue}
              onChange={handlePriceChange}
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Digite a descrição do produto"
              className="border border-app-border bg-app-background text-white rounded-md resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category" className="mb-2">
              Categoria
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="border border-app-border bg-app-background text-white rounded-md">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-app-card border border-app-border text-white rounded-md curso-pointer">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="mb-2">
              Imagem do produto
            </Label>

            {imagePreview ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="preview da imagem"
                  fill
                  className="object-cover"
                />

                <Button
                  type="button"
                  variant="destructive"
                  className="absolute top-2 right-2 z-20 bg-red-500 hover:bg-red-500yhyh text-white rounded-md"
                  onClick={clearImage}
                >
                  Excluir
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <Label htmlFor="file">Clique para selecionar uma imagem</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  required
                  className="hidden"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary rounded-md disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ProductForm };
