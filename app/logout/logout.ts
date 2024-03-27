"use server";

import { cookies } from "next/headers";

export default async function logout() {
  cookies().delete("session");
  cookies().delete("image");
}
