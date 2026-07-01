"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { deleteProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteButtonProps {
  productId: string;
}

const DeleteButtonProduct = ({ productId }: DeleteButtonProps) => {
  const router = useRouter();

  const handleDeleteProduct = async () => {
    const result = await deleteProductAction(productId);

    if (result?.success) {
      router.refresh();
      toast.success("Produto deletado com sucesso");
      return;
    }

    if (result?.error !== "") {
      toast.error("Falha ao deletar produto", {
        className: "!bg-red-500 !text-white !border-red-500",
      });
    }
  };
  return (
    <Button onClick={handleDeleteProduct} className="rounded-md bg-red-500">
      <Trash className="w-5 h-5" />
    </Button>
  );
};

export { DeleteButtonProduct };
