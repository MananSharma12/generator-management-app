import { supabase } from "~/supabaseClient";
import { sessionStore } from "~/store/store.ts";
import { v4 } from "uuid";

interface Generator {
  customerId: number;
  equipmentNo: string;
  equipmentDescription?: string;
  address?: string;
  city?: string;
  geniusGenset?: boolean;
  rmuNumber?: string;
  dateOfCommissioning?: Date;
  inWarranty?: boolean;
  type?: "AMC" | "In Fold" | "Out of Fold";
  status?: boolean;
  lastServiceDone?: Date;
  nextServiceDue?: Date;
}

export async function addCustomer(customer: {
  name: string;
  email_id: string;
  mobile_numbers: string[];
}) {
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase.from("customers").insert([
    {
      name: customer.name,
      email_id: customer.email_id,
      mobile_numbers: customer.mobile_numbers,
      user_id: user.id,
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
    .select("id, name, email_id, mobile_numbers, user_id")
    .eq("user_id", user.id);
  if (error) throw error;
  return data;
}

export async function addGenerator(generator: Generator) {
  const { data: existingGenerators, error: fetchError } = await supabase
    .from("generators")
    .select("id")
    .eq("equipment_no", generator.equipmentNo);

  if (fetchError) {
    throw new Error("Error fetching generator. Please try again.");
  }

  if (existingGenerators.length > 0) {
    throw new Error("Serial number already associated with another generator.");
  }

  const { data, error } = await supabase.from("generators").insert([
    {
      id: v4(),
      customer_id: generator.customerId,
      equipment_no: generator.equipmentNo,
      equipment_description: generator.equipmentDescription,
      address: generator.address,
      city: generator.city,
      genius_genset: generator.geniusGenset,
      rmu_number: generator.rmuNumber,
      date_of_commissioning: generator.dateOfCommissioning,
      in_warranty: generator.inWarranty,
      type: generator.type,
      status: generator.status,
      last_service_done: generator.lastServiceDone,
      next_service_due: generator.nextServiceDue,
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
