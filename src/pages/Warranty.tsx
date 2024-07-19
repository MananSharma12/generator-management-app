import { createResource, For, Show } from "solid-js";
import { fetchPastDueGenerators } from "~/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Progress,
  ProgressLabel,
  ProgressValueLabel,
} from "~/components/ui/progress";

export const Warranty = () => {
  const [pastDueGenerators] = createResource(fetchPastDueGenerators);

  return (
    <div class="flex flex-col space-y-4">
      <h1 class="text-2xl font-semibold">Past Due Warranties</h1>
      <Show
        when={!pastDueGenerators.loading}
        fallback={
          <div class="flex flex-col items-center justify-center min-h-[200px]">
            <Progress
              value={50}
              minValue={0}
              maxValue={100}
              class="w-[300px] space-y-1"
            >
              <div class="flex justify-between">
                <ProgressLabel>Loading warranties...</ProgressLabel>
                <ProgressValueLabel />
              </div>
            </Progress>
          </div>
        }
      >
        <Show
          when={!pastDueGenerators.error}
          fallback={
            <p class="text-red-500">
              Error loading warranties: {pastDueGenerators.error?.message}
            </p>
          }
        >
          <Show
            when={(pastDueGenerators() ?? []).length > 0}
            fallback={<p>No past due warranties found.</p>}
          >
            <Table>
              <TableCaption>
                Past due generators across all your customers.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Equipment Number</TableHead>
                  <TableHead>Install Date</TableHead>
                  <TableHead>Warranty Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <For each={pastDueGenerators()}>
                  {(generator) => (
                    <TableRow>
                      <TableCell>{generator.customerName}</TableCell>
                      <TableCell>{generator.equipment_no}</TableCell>
                      <TableCell>
                        {generator.date_of_commissioning.toLocaleString(
                          "en-IN",
                        )}
                      </TableCell>
                      <TableCell class="text-red-500 font-semibold">
                        {generator.date_of_commissioning.toLocaleString(
                          "en_IN",
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </Show>
        </Show>
      </Show>
    </div>
  );
};
