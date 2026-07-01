"use server";

import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function finishOrderAction(orderId: String) {
  if (!orderId) {
    return { success: false, error: "Falha ao finalizar pedido" };
  }

  const token = await getToken();

  if (!token) {
    return { success: false, error: "Falha ao finalizar pedido" };
  }
  try {
    const data = {
      order_id: orderId,
    };

    await apiClient("/order/finish", {
      method: "PUT",
      body: JSON.stringify(data),
      token: token,
    });

    revalidatePath("/dashboard");

    return { success: true, error: "" };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Falha ao finalizar pedido" };
  }
}
