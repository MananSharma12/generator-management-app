import { supabase } from "~/supabaseClient";
import { sessionStore } from "~/store/store.ts";
import { v4 } from "uuid";
import { sendServiceDueEmail } from "~/utils/email.ts";

interface Generator {
  customerId: number;
  equipmentNo: string;
  equipmentDescription?: string;
  address?: string;
  city?: string;
  geniusGenset: boolean;
  rmuNumber: "" | number;
  dateOfCommissioning?: Date;
  inWarranty?: boolean;
  type: "AMC" | "In Fold" | "Out of Fold";
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
  const user = sessionStore.session?.user;
  if (!user) throw new Error("User not logged in");

  let query = supabase.from("generators").select("*");
  if (customerId) {
    query = query.eq("customer_id", customerId);
  }

  const { data: generators, error } = await query;

  if (error) {
    throw new Error("Error fetching generators.");
  }

  if (!generators) {
    return [];
  }

  const today = new Date();
  const userEmail = user.email;

  if (!userEmail) {
    throw new Error("User email not found in session.");
  }

  for (const generator of generators) {
    console.log(generator);
    if (generator.next_service_due) {
      const nextServiceDue = new Date(generator.next_service_due);
      if (nextServiceDue < today) {
        const generatorInfo = `ID: ${generator.equipment_no}, Serial: ${generator.equipment_description}`;
        try {
          await sendServiceDueEmail(userEmail, generatorInfo);
        } catch (emailError) {
          console.error(
            "Failed to send email for generator:",
            generatorInfo,
            emailError,
          );
        }
      }
    }
  }

  return generators;
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
      .select(`*, customers!inner(name)`)
      .lt("next_service_due", today)
      .eq("customer_id", customer.id);

    if (generatorError) throw new Error("Error fetching generators");

    pastDueGenerators.push(
      ...generators.map((g) => ({ ...g, customerName: customer.name })),
    );
  }

  return pastDueGenerators;
}

export async function updateGeneratorService(
  generatorId: string,
  lastServiceDone: Date,
  nextServiceDue: Date,
) {
  const { data, error } = await supabase
    .from("generators")
    .update({
      last_service_done: lastServiceDone,
      next_service_due: nextServiceDue,
    })
    .eq("id", generatorId);

  if (error) {
    throw new Error("Error updating generator service.");
  }

  return data;
}
