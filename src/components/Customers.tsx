import { createResource, onMount, For } from "solid-js";
import { A } from "@solidjs/router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getCustomers } from "~/api.ts";

interface CustomersProps {
  setRefetchCustomers: (refetch: () => void) => void;
}

export const Customers = (props: CustomersProps) => {
  const [customers, { refetch }] = createResource(getCustomers);

  onMount(() => {
    props.setRefetchCustomers(() => refetch);
  });

  return (
    <Table>
      <TableCaption>A list of your customers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Customer Email</TableHead>
          <TableHead>Customer Phones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody class="w-full">
        <For each={customers()}>
          {(customer) => (
            <TableRow>
              <TableCell>
                <A href={"/generators/" + customer.id} class="block w-full">
                  {customer.name}
                </A>
              </TableCell>
              <TableCell>{customer.email_id}</TableCell>
              <TableCell>
                <For each={customer.mobile_numbers}>
                  {(phone) => <div>{phone}</div>}
                </For>
              </TableCell>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  );
};
