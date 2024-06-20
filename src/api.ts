import { supabase } from "./supabaseClient";

export async function addCustomer(name: string) {
  const { data, error } = await supabase.from("Customer").insert([{ name }]);
  if (error) throw error;
  return data;
}

export async function getCustomers() {
  const { data, error } = await supabase
    .from("Customer")
    .select("id, name, Generators(id, serialNumber, installDate, warrantyDate)")
    .eq("Generators.customerId", "Customers.id");
  if (error) throw error;
  return data;
}

export async function getCustomersWithDueWarranty() {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from("Generator")
    .select(
      "customerId, Customers(id, name, Generators(id, serialNumber, installDate, warrantyDate))",
    )
    .eq("Generators.customerId", "Customers.id")
    .lt("warrantyDate", today);
  if (error) throw error;
  return data;
}
