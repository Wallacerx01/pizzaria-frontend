"use server";

import { apiClient } from "@/lib/api";
import { AuthResponse, User } from "@/lib/types";
import { getToken, removeToken, setToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerAction(
  prevState: { success: boolean; error: string; redirectTo?: string } | null,
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = {
      name: name,
      email: email,
      password: password,
    };

    await apiClient<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return { success: true, error: "", redirectTo: "/login" };
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }

    return { success: false, error: "Error ao criar conta" };
  }
}

export async function loginAction(
  prevState: { success: boolean; error: string; redirectTo?: string } | null,
  formData: FormData,
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = {
      email: email,
      password: password,
    };

    const response = await apiClient<AuthResponse>("/session", {
      method: "POST",
      body: JSON.stringify(data),
    });

    await setToken(response.token);

    return { success: true, error: "", redirectTo: "/dashboard" };
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return { success: false, error: err.message || "Error ao fazer login" };
    }

    return { success: false, error: "Error ao fazer login" };
  }
}

export async function logoutAction() {
  await removeToken();
  redirect("/login");
}
