import { addCustomer } from "~/api";
import { AddCustomerDialog } from "~/components/AddCustomerDialog";
import { Customers } from "~/components/Customers.tsx";

export const Dashboard = () => {
  const handleAddCustomer = async (customerName: string) => {
    try {
      await addCustomer(customerName);
    } catch (error) {
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
        <Customers />
      </div>
    </div>
  );
};
