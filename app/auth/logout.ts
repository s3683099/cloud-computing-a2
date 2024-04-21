"use server";

import { cookies } from "next/headers";

export default async function logout() {
  cookies().delete("email");
  cookies().delete("session");
}
