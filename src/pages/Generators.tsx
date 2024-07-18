import { createResource, For, Show } from "solid-js";
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
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div class="flex flex-col space-y-4">
      <h1 class="text-2xl font-semibold">
        Generators for Customer {customerId}
      </h1>
      <AddGeneratorDialog customerId={customerId} onAddGenerator={refetch} />
      <Table>
        <Show when={generators()?.length === 0}>
          <TableCaption>No generators found for this customer.</TableCaption>
        </Show>
        <TableHeader>
          <TableRow>
            <TableHead>Equipment No.</TableHead>
            <TableHead>Equipment Description</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Date of Commissioning</TableHead>
            <TableHead>Service Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={generators()}>
            {(generator) => (
              <TableRow>
                <TableCell class="font-medium">
                  {generator.equipment_no}
                </TableCell>
                <TableCell>{generator.equipment_description}</TableCell>
                <TableCell>
                  {generator.address}, {generator.city}
                </TableCell>
                <TableCell>
                  {generator.date_of_commissioning.toLocaleString("en-HI")}
                </TableCell>
                <TableCell
                  class={
                    isPastDate(generator.next_service_due) ? "text-red-500" : ""
                  }
                >
                  {generator.next_service_due.toLocaleString("en-HI")}
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </div>
  );
};
