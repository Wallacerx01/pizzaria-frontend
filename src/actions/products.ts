"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createProductAction(formdata: FormData) {
  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Erro ao criar produto" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/product`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Erro ao criar produto" };
    }

    const product = (await response.json()) as Product;

    revalidatePath("/dashboard/products");
    return { success: true, data: product };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return { success: false, error: "Erro ao criar produto" };
  }
}

export async function getProductsAction(disabled: string = "false") {
  try {
    const token = await getToken();

    if (!token) {
      return { success: false, error: "Erro ao buscar produtos" };
    }

    const products = await apiClient<Product[]>(
      `/products?disabled=${disabled}`,
      {
        token: token,
      },
    );

    return { success: true, data: products };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return { success: false, error: "Erro ao buscar produtos" };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const token = await getToken();

    if (!token || !productId) {
      return { success: false, error: "Falha ao deletar produto" };
    }

    await apiClient(`/product?product_id=${productId}`, {
      method: "DELETE",
      token: token,
    });

    revalidatePath("/dashboard/products");
    return { success: true, error: "" };
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
  }
}
