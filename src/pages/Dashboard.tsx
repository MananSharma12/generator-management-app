import { createSignal } from "solid-js";
import { addCustomer } from "~/api";
import { AddCustomerDialog } from "~/components/AddCustomerDialog";
import { Customers } from "~/components/Customers.tsx";
import { showToast } from "~/components/ui/toast.tsx";

export const Dashboard = () => {
  const [refetchCustomers, setRefetchCustomers] = createSignal<() => void>(
    () => {},
  );

  const handleAddCustomer = async (customerName: string) => {
    try {
      await addCustomer(customerName);
      showToast({
        title: "SUCCESS!",
        description: "Customer Successfully Added!",
        variant: "success",
      });
      refetchCustomers()();
    } catch (error) {
      showToast({
        title: "ERROR!",
        description: "Error Adding Customer",
        variant: "error",
      });
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div class="flex flex-col space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Dashboard</h1>
        <AddCustomerDialog onAddCustomer={handleAddCustomer} />
      </div>
      <div>
        <Customers setRefetchCustomers={setRefetchCustomers} />
      </div>
    </div>
  );
};
