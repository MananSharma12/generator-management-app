import { createResource, For } from "solid-js";
import { useParams } from "@solidjs/router";

import { supabase } from "~/supabaseClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { AddGeneratorDialog } from "~/components/AddGeneratorDialog";

const fetchGenerators = async (customerId?: number) => {
  let query = supabase.from("Generator").select("*");

  if (customerId) {
    query = query.eq("customerId", customerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching generators:", error);
    return [];
  }
  return data;
};

export const Generators = () => {
  const params = useParams();
  const customerId = params.customerId
    ? parseInt(params.customerId)
    : undefined;
  const [generators, { refetch }] = createResource(() =>
    fetchGenerators(customerId),
  );

  return (
    <div class="flex flex-col space-y-4">
      <h1 class="text-2xl font-semibold">
        {customerId
          ? `Generators for Customer ${customerId}`
          : "All Generators"}
      </h1>
      <AddGeneratorDialog customerId={customerId} onAddGenerator={refetch} />
      <Table>
        <TableCaption>A list of generators.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">Generator ID</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Install Date</TableHead>
            <TableHead>Warranty Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={generators()}>
            {(generator) => (
              <TableRow>
                <TableCell class="font-medium">{generator.id}</TableCell>
                <TableCell>{generator.serialNumber}</TableCell>
                <TableCell>
                  {new Date(generator.installDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(generator.warrantyDueDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
      {generators()?.length === 0 && (
        <p>No generators found for this customer.</p>
      )}
    </div>
  );
};
