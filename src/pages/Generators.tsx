import { createResource, For } from "solid-js";
import { useParams } from "@solidjs/router";

import { fetchGenerators } from "~/api";
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

export const Generators = () => {
  const params = useParams();
  const customerId = parseInt(params.customerId);
  const [generators, { refetch }] = createResource(() =>
    fetchGenerators(customerId),
  );

  const isPastDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of the day for accurate comparison
    return date < today;
  };

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
                <TableCell>{generator.serial_number}</TableCell>
                <TableCell>
                  {new Date(generator.install_date).toLocaleDateString()}
                </TableCell>
                <TableCell
                  class={
                    isPastDate(generator.warranty_due_date)
                      ? "text-red-500"
                      : ""
                  }
                >
                  {new Date(generator.warranty_due_date).toLocaleDateString()}
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
