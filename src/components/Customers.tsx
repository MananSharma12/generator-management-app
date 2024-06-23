import { createResource, onMount, For } from "solid-js";
import { A } from "@solidjs/router";
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

interface CustomersProps {
  setRefetchCustomers: (refetch: () => void) => void;
}

const fetchCustomers = async () => {
  const { data, error } = await supabase.from("Customer").select("id, name");

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
  return data;
};

export const Customers = (props: CustomersProps) => {
  const [customers, { refetch }] = createResource(fetchCustomers);

  onMount(() => {
    props.setRefetchCustomers(() => refetch);
  });

  return (
    <Table>
      <TableCaption>A list of your customers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Customer ID</TableHead>
          <TableHead>Customer Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody class="w-full">
        <For each={customers()}>
          {(customer) => (
            <TableRow>
              <TableCell class="font-medium">{customer.id}</TableCell>
              <A href={"/generators/" + customer.id} class="block w-full">
                <TableCell>{customer.name}</TableCell>
              </A>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  );
};
