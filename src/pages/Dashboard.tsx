import { Button } from "~/components/ui/button";

export const Dashboard = () => {
  return (
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Dashboard</h1>
      <Button size="sm" onClick={() => {}}>
        Add Customer
      </Button>
    </div>
  );
};
