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

export async function fetchPastDueGenerators() {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data: customers, error: customerError } = await supabase
    .from("customers")
    .select("id, name")
    .eq("user_id", user.id);

  if (customerError) throw new Error("Error fetching customers");

  const pastDueGenerators = [];
  const today = new Date().toISOString().split("T")[0];

  for (const customer of customers) {
    console.log("For", customer);
    const { data: generators, error: generatorError } = await supabase
      .from("generators")
      .select(`*, customers(name)`)
      .lt("warranty_due_date", today)
      .eq("customer_id", customer.id);

    if (generatorError) throw new Error("Error fetching generators");

    console.log("We have generator", generators);
    console.log("List so far", pastDueGenerators);

    pastDueGenerators.push(
      ...generators.map((g) => ({ ...g, customerName: customer.name })),
    );
  }

  return pastDueGenerators;
}
