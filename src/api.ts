import { supabase } from "./supabaseClient";
import { sessionStore } from "~/store/store.ts";

export async function addCustomer(name: string) {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("Customer")
    .insert([{ name, user_id: user.id }]);
  if (error) throw error;
  return data;
}

export async function getCustomers() {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("Customer")
    .select("id, name, Generators(id, serialNumber, installDate, warrantyDate)")
    .eq("user_id", user.id);
  if (error) throw error;
  return data;
}

export async function getCustomersWithDueWarranty() {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from("Generator")
    .select(
      "customerId, Customers(id, name, Generators(id, serialNumber, installDate, warrantyDate))",
    )
    .eq("user_id", user.id)
    .lt("warrantyDate", today);
  if (error) throw error;
  return data;
}
