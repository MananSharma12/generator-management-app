import { createSignal, For } from "solid-js";
import { Button } from "~/components/ui/button";

interface AddCustomerDialogProps {
  onAddCustomer: (customer: {
    name: string;
    email: string;
    phones: string[];
  }) => void;
}

export const AddCustomerDialog = ({
  onAddCustomer,
}: AddCustomerDialogProps) => {
  let dialogRef: HTMLDialogElement | null = null;
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [phones, setPhones] = createSignal<string[]>([""]);

  const openDialog = () => {
    dialogRef?.showModal();
  };

  const closeDialog = () => {
    dialogRef?.close();
  };

  const handleAddCustomer = async () => {
    if (
      name().trim() === "" ||
      email().trim() === "" ||
      phones().some((phone) => phone.trim() === "")
    ) {
      alert("All fields must be filled out");
      return;
    }
    try {
      onAddCustomer({ name: name(), email: email(), phones: phones() });
      setName("");
      setEmail("");
      setPhones([""]);
      closeDialog();
    } catch (error) {
      console.error("Failed to add customer", error);
      alert("Failed to add customer");
    }
  };

  const addPhoneField = () => setPhones([...phones(), ""]);

  const updatePhoneField = (index: number, value: string) => {
    const updatedPhones = phones().slice();
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
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder="Customer Name"
          class="border p-2 rounded mb-2 w-full"
        />
        <input
          type="email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          placeholder="Customer Email"
          class="border p-2 rounded mb-2 w-full"
        />
        <div>
          <label>Phone Numbers</label>
          <For each={phones()}>
            {(phone, index) => (
              <input
                type="text"
                value={phone}
                onInput={(e) =>
                  updatePhoneField(index(), e.currentTarget.value)
                }
                placeholder={`Phone ${index() + 1}`}
                class="border p-2 rounded mb-2 w-full"
              />
            )}
          </For>
          <Button size="sm" onClick={addPhoneField} class="mb-2">
            Add Another Phone
          </Button>
        </div>
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
