import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";

interface AddCustomerDialogProps {
  onAddCustomer: (customerName: string) => void;
}

export const AddCustomerDialog = ({
  onAddCustomer,
}: AddCustomerDialogProps) => {
  let dialogRef: HTMLDialogElement | null = null;
  const [customerName, setCustomerName] = createSignal("");

  const openDialog = () => {
    dialogRef?.showModal();
  };

  const closeDialog = () => {
    dialogRef?.close();
  };

  const handleAddCustomer = async () => {
    onAddCustomer(customerName());
    setCustomerName("");
    closeDialog();
  };

  return (
    <>
      <Button size="sm" onClick={openDialog}>
        Add Customer
      </Button>
      <dialog ref={(el) => (dialogRef = el)} class="p-4 rounded shadow-lg">
        <h2 class="text-lg font-medium mb-2">Add Customer</h2>
        <input
          type="text"
          value={customerName()}
          onInput={(e) => setCustomerName(e.currentTarget.value)}
          placeholder="Customer Name"
          class="border p-2 rounded mb-2 w-full"
        />
        <div class="flex justify-end space-x-2">
          <Button class="w-full" variant="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button class="w-full" onClick={handleAddCustomer}>
            Add
          </Button>
        </div>
      </dialog>
    </>
  );
};
