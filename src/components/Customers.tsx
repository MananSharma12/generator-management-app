import { createResource, For } from "solid-js";
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

const fetchCustomers = async () => {
  const { data, error } = await supabase.from("Customer").select("id, name");

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
  return data;
};

export const Customers = () => {
  const [customers] = createResource(fetchCustomers);

  return (
    <Table>
      <TableCaption>A list of your customers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Customer ID</TableHead>
          <TableHead>Customer Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <For each={customers()}>
          {(customer) => (
            <TableRow>
              <TableCell class="font-medium">{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  );
};
