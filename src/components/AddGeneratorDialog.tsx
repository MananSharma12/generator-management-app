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
  const [equipmentNo, setEquipmentNo] = createSignal("");
  const [equipmentDescription, setEquipmentDescription] = createSignal("");
  const [address, setAddress] = createSignal("");
  const [city, setCity] = createSignal("");
  const [geniusGenset, setGeniusGenset] = createSignal(false);
  const [rmuNumber, setRmuNumber] = createSignal<"" | number>("");
  const [dateOfCommissioning, setDateOfCommissioning] = createSignal("");
  const [inWarranty, setInWarranty] = createSignal(false);
  const [type, setType] = createSignal<"AMC" | "In Fold" | "Out of Fold">(
    "AMC",
  );
  const [status, setStatus] = createSignal(false);

  const openDialog = () => {
    dialogRef?.showModal();
  };

  const closeDialog = () => {
    dialogRef?.close();
  };

  const handleAddGenerator = async () => {
    const commissioningDate = new Date(dateOfCommissioning());
    const nextServiceDue = new Date(commissioningDate);
    nextServiceDue.setMonth(commissioningDate.getMonth() + 6);

    const generator = {
      customerId,
      equipmentNo: equipmentNo(),
      equipmentDescription: equipmentDescription(),
      address: address(),
      city: city(),
      geniusGenset: geniusGenset(),
      rmuNumber: rmuNumber(),
      dateOfCommissioning: commissioningDate,
      inWarranty: inWarranty(),
      type: type(),
      status: status(),
      nextServiceDue: nextServiceDue,
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
        error instanceof Error ? error.message : "An unknown error occurred.";
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
      <dialog
        ref={(el) => (dialogRef = el)}
        class="p-4 rounded shadow-lg text-left w-96"
      >
        <h2 class="text-lg font-medium mb-2">Add Generator</h2>
        <div class="mb-2">
          <label
            for="equipmentNo"
            class="block text-sm font-medium text-gray-700"
          >
            Equipment No
          </label>
          <input
            id="equipmentNo"
            type="text"
            value={equipmentNo()}
            onInput={(e) => setEquipmentNo(e.currentTarget.value)}
            placeholder="Equipment No"
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label
            for="equipmentDescription"
            class="block text-sm font-medium text-gray-700"
          >
            Equipment Description
          </label>
          <input
            id="equipmentDescription"
            type="text"
            value={equipmentDescription()}
            onInput={(e) => setEquipmentDescription(e.currentTarget.value)}
            placeholder="Equipment Description"
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label for="address" class="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={address()}
            onInput={(e) => setAddress(e.currentTarget.value)}
            placeholder="Address"
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label for="city" class="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city()}
            onInput={(e) => setCity(e.currentTarget.value)}
            placeholder="City"
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label
            for="geniusGenset"
            class="block text-sm font-medium text-gray-700"
          >
            Genius Genset
          </label>
          <input
            id="geniusGenset"
            type="checkbox"
            checked={geniusGenset()}
            onChange={(e) => setGeniusGenset(e.currentTarget.checked)}
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label
            for="rmuNumber"
            class="block text-sm font-medium text-gray-700"
          >
            RMU Number
          </label>
          <input
            id="rmuNumber"
            type="text"
            value={rmuNumber()}
            onInput={(e) => {
              const value = e.currentTarget.value;
              setRmuNumber(value === "" ? "" : Number(value));
            }}
            placeholder="RMU Number"
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label
            for="dateOfCommissioning"
            class="block text-sm font-medium text-gray-700"
          >
            Date of Commissioning
          </label>
          <input
            id="dateOfCommissioning"
            type="date"
            value={dateOfCommissioning()}
            onInput={(e) => setDateOfCommissioning(e.currentTarget.value)}
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label
            for="inWarranty"
            class="block text-sm font-medium text-gray-700"
          >
            In Warranty
          </label>
          <input
            id="inWarranty"
            type="checkbox"
            checked={inWarranty()}
            onChange={(e) => setInWarranty(e.currentTarget.checked)}
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="mb-2">
          <label for="type" class="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            value={type()}
            onInput={(e) =>
              setType(
                e.currentTarget.value as "AMC" | "In Fold" | "Out of Fold",
              )
            }
            class="border p-2 rounded w-full"
          >
            <option value="AMC">AMC</option>
            <option value="In Fold">In Fold</option>
            <option value="Out of Fold">Out of Fold</option>
          </select>
        </div>
        <div class="mb-2">
          <label for="status" class="block text-sm font-medium text-gray-700">
            Status
          </label>
          <input
            id="status"
            type="checkbox"
            checked={status()}
            onChange={(e) => setStatus(e.currentTarget.checked)}
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
