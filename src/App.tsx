import { Component, JSX } from "solid-js";

import { Header } from "./components/Header.tsx";
import { Navigation } from "~/components/Navigation.tsx";
import { Toaster } from "~/components/ui/toast";
import { ColorModeProvider } from "@kobalte/core";

const App: Component<{ children?: JSX.Element | JSX.Element[] }> = (props) => {
  return (
    <div class="flex flex-col h-screen">
      <div class="flex h-screen w-full overflow-hidden">
        <Navigation />
        <ColorModeProvider>
          <Header>{props.children}</Header>
        </ColorModeProvider>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
