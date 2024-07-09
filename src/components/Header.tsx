import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";

import { Package2Icon } from "~/assets/icons/Package2Icon.tsx";
import { Component, JSX } from "solid-js";
import { supabase } from "~/supabaseClient.ts";
import { useNavigate } from "@solidjs/router";
import { showToast } from "~/components/ui/toast.tsx";

export const Header: Component<{ children: JSX.Element | JSX.Element[] }> = (
  props,
) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    showToast({
      title: "Logged Out",
      description: "Successfully Logged Out!",
      variant: "default",
    });
  };

  return (
    <div class="flex flex-1 flex-col">
      <header class="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <div class="lg:hidden">
          <Package2Icon class="h-6 w-6" />
          <span class="sr-only">Home</span>
        </div>
        <div class="w-full flex-1">
          <div class="flex items-center justify-between">
            <span>Hello, Username!</span>
            <span>Subscription expires in 30 days</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              class="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
            >
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main class="flex-1 p-4 md:p-6">{props.children}</main>
    </div>
  );
};
