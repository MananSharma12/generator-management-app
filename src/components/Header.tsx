import { Button } from "~/components/ui/button";

export const Header = () => {
  return (
    <header class="bg-gray-900 text-white p-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Customer Generator Manager</h1>
      <Button>Add Customer</Button>
    </header>
  );
};
