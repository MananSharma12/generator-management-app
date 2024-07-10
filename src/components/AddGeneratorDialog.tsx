import { createSignal } from "solid-js";
import { addGenerator } from "~/api.ts";
import { Button } from "~/components/ui/button";
import { showToast } from "~/components/ui/toast.tsx";

interface AddGeneratorDialogProps {
  customerId: number;
  onAddGenerator: () => void;
}

export const AddGeneratorDialog = ({
  customerId,
  onAddGenerator,
}: AddGeneratorDialogProps) => {
  let dialogRef: HTMLDialogElement | null = null;
  const [serialNumber, setSerialNumber] = createSignal("");
  const [installDate, setInstallDate] = createSignal("");
  const [warrantyDate, setWarrantyDate] = createSignal("");

  const openDialog = () => {
    dialogRef?.showModal();
  };

  const closeDialog = () => {
    dialogRef?.close();
  };

  const handleAddGenerator = async () => {
    const generator = {
      serialNumber: serialNumber(),
      installDate: new Date(installDate()),
      warrantyDueDate: new Date(warrantyDate()),
      customerId,
    };

    try {
      await addGenerator(generator);
      onAddGenerator();
      closeDialog();
      showToast({
        title: "SUCCESS!",
        description: "Generator Successfully Added!",
        variant: "success",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occured.";
      showToast({
        title: "ERROR!",
        description: errorMessage,
        variant: "error",
      });
    }
  };

  return (
    <>
      <Button size="sm" onClick={openDialog}>
        Add Generator
      </Button>
      <dialog ref={(el) => (dialogRef = el)} class="p-4 rounded shadow-lg">
        <h2 class="text-lg font-medium mb-2">Add Generator</h2>
        <div class="mb-2">
          <label
            for="serialNumber"
            class="block text-sm font-medium text-gray-700"
          >
            Serial Number
          </label>
          <input
            id="serialNumber"
            type="text"
            value={serialNumber()}
            onInput={(e) => setSerialNumber(e.currentTarget.value)}
            placeholder="Serial Number"
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label
            for="installDate"
            class="block text-sm font-medium text-gray-700"
          >
            Install Date
          </label>
          <input
            id="installDate"
            type="date"
            value={installDate()}
            onInput={(e) => setInstallDate(e.currentTarget.value)}
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label
            for="warrantyDate"
            class="block text-sm font-medium text-gray-700"
          >
            Warranty Date
          </label>
          <input
            id="warrantyDate"
            type="date"
            value={warrantyDate()}
            onInput={(e) => setWarrantyDate(e.currentTarget.value)}
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <Button class="w-full" variant="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button class="w-full" onClick={handleAddGenerator}>
            Add
          </Button>
        </div>
      </dialog>
    </>
  );
};
