import { createSignal } from "solid-js";
import { updateGeneratorService } from "~/api.ts";
import { Button } from "~/components/ui/button";
import { showToast } from "~/components/ui/toast.tsx";

interface LogServiceDialogProps {
  generatorId: string;
  nextServiceDue: Date;
  onServiceLogged: () => void;
}

export const LogServiceDialog = ({
  generatorId,
  nextServiceDue,
  onServiceLogged,
}: LogServiceDialogProps) => {
  let dialogRef: HTMLDialogElement | null = null;
  const [serviceDate, setServiceDate] = createSignal("");

  const openDialog = () => {
    dialogRef?.showModal();
  };

  const closeDialog = () => {
    dialogRef?.close();
  };

  const handleLogService = async () => {
    const serviceDateValue = new Date(serviceDate());
    const nextServiceDueValue = new Date(nextServiceDue);
    nextServiceDueValue.setMonth(nextServiceDueValue.getMonth() + 6);

    try {
      await updateGeneratorService(
        generatorId,
        serviceDateValue,
        nextServiceDueValue,
      );
      onServiceLogged();
      closeDialog();
      showToast({
        title: "SUCCESS!",
        description: "Service Successfully Logged!",
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
        Log Service
      </Button>
      <dialog
        ref={(el) => (dialogRef = el)}
        class="p-4 rounded shadow-lg text-left w-96"
      >
        <h2 class="text-lg font-medium mb-2">Log Service</h2>
        <div class="mb-2">
          <label
            for="serviceDate"
            class="block text-sm font-medium text-gray-700"
          >
            Service Date
          </label>
          <input
            id="serviceDate"
            type="date"
            value={serviceDate()}
            onInput={(e) => setServiceDate(e.currentTarget.value)}
            class="border p-2 rounded w-full"
          />
        </div>
        <div class="flex justify-end space-x-2">
          <Button class="w-full" variant="secondary" onClick={closeDialog}>
            Cancel
          </Button>
          <Button class="w-full" onClick={handleLogService}>
            Log
          </Button>
        </div>
      </dialog>
    </>
  );
};
