import { supabase } from "~/supabaseClient";
import { sessionStore } from "~/store/store.ts";
import { v4 } from "uuid";

interface Generator {
  serialNumber: string;
  customerId: string;
  installDate: Date;
  warrantyDueDate: Date;
}

export async function addCustomer(customer: {
  name: string;
  email: string;
  phones: string[];
}) {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase.from("customers").insert([
    {
      id: user.id,
      name: customer.name,
      email_id: customer.email,
      mobile_numbers: customer.phones,
    },
  ]);
  if (error) throw error;
  return data;
}

export async function getCustomers() {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email_id, mobile_numbers")
    .eq("id", user.id);
  if (error) throw error;
  return data;
}

export async function addGenerator(generator: Generator) {
  const { data: existingGenerators, error: fetchError } = await supabase
    .from("generators")
    .select("id")
    .eq("serial_number", generator.serialNumber);

  if (fetchError) {
    throw new Error("Error fetching generator. Please try again.");
  }

  if (existingGenerators.length > 0) {
    throw new Error("Serial number already associated with another generator.");
  }

  const { data, error } = await supabase.from("generators").insert([
    {
      id: v4(),
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

export async function fetchGenerators(customerId?: string) {
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
    .select("id, name");

  if (customerError) throw new Error("Error fetching customers");

  const pastDueGenerators = [];
  const today = new Date().toISOString().split("T")[0];

  for (const customer of customers) {
    const { data: generators, error: generatorError } = await supabase
      .from("generators")
      .select(`*, customers(name)`)
      .lt("warranty_due_date", today)
      .eq("customer_id", customer.id);

    if (generatorError) throw new Error("Error fetching generators");

    pastDueGenerators.push(
      ...generators.map((g) => ({ ...g, customerName: customer.name })),
    );
  }

  return pastDueGenerators;
}
