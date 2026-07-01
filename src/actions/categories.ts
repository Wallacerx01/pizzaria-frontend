"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formdata: FormData) {
  try {
    const token = await getToken();
    const name = formdata.get("name");

    if (!token) {
      return { success: false, error: "Error ao criar categoria" };
    }

    const data = {
      name: name,
    };

    await apiClient<Category>("/category", {
      method: "POST",
      token: token,
      body: JSON.stringify(data),
    });

    revalidatePath("/dashboard/categories");
    return { success: true, error: "" };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return { success: false, error: "Error ao criar categoria" };
  }
}
