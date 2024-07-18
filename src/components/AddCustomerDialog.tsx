import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/button";

interface AddCustomerDialogProps {
  onAddCustomer: (customer: {
    name: string;
    email_id: string;
    mobile_numbers: string[];
  }) => void;
}

export const AddCustomerDialog = ({
  onAddCustomer,
}: AddCustomerDialogProps) => {
  let dialogRef: HTMLDialogElement | null = null;
  const [customerName, setCustomerName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [phones, setPhones] = createSignal<string[]>([""]);

  const openDialog = () => {
    dialogRef?.showModal();
  };

  const closeDialog = () => {
    dialogRef?.close();
  };

  const handleAddCustomer = async () => {
    onAddCustomer({
      name: customerName(),
      email_id: email(),
      mobile_numbers: phones(),
    });
    setCustomerName("");
    setEmail("");
    setPhones([""]);
    closeDialog();
  };

  const addPhoneField = () => {
    setPhones([...phones(), ""]);
  };

  const updatePhoneField = (index: number, value: string) => {
    const updatedPhones = [...phones()];
    updatedPhones[index] = value;
    setPhones(updatedPhones);
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
        <input
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          placeholder="Email"
          class="border p-2 rounded mb-2 w-full"
        />
        <For each={phones()}>
          {(phone, index) => (
            <input
              type="text"
              value={phone}
              onInput={(e) => updatePhoneField(index(), e.currentTarget.value)}
              placeholder={`Phone ${index() + 1}`}
              class="border p-2 rounded mb-2 w-full"
            />
          )}
        </For>
        <Button size="sm" onClick={addPhoneField}>
          Add Phone
        </Button>
        <div class="flex justify-end space-x-2 mt-4">
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
