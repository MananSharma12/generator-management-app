import { supabase } from "./supabaseClient";
import { sessionStore } from "~/store/store.ts";

export async function addCustomer(name: string) {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("customers")
    .insert([{ name, user_id: user.id }]);
  if (error) throw error;
  return data;
}

export async function getCustomers() {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("customers")
    .select("id, name")
    .eq("user_id", user.id);
  if (error) throw error;
  return data;
}

export async function addGenerator(generator: {
  serialNumber: string;
  customerId: number;
  installDate: Date;
  warrantyDueDate: Date;
}) {
  // const { data: existingGenerators, error: fetchError } = await supabase
  //   .from("generators")
  //   .select("id")
  //   .eq("serial_number", generator.serialNumber);

  // if (fetchError) {
  //   throw new Error("Error fetching generator. Please try again.");
  // }

  // if (existingGenerators.length > 0) {
  //   throw new Error("Serial number already associated with another generator.");
  // }

  const { data, error } = await supabase.from("generators").insert([
    {
      serial_number: generator.serialNumber,
      customer_id: generator.customerId,
      install_date: generator.installDate,
      warranty_due_date: generator.warrantyDueDate,
    },
  ]);

  if (error) {
    throw new Error("Error adding generator.");
  }

  return data;
}

export async function fetchGenerators(customerId?: number) {
  let query = supabase.from("generators").select("*");

  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Error fetching generators.");
  }

  return data;
}
