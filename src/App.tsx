import { Component, JSX } from "solid-js";

import { Header } from "./components/Header.tsx";
import { Navigation } from "~/components/Navigation.tsx";

const App: Component<{ children: JSX.Element | JSX.Element[] }> = (props) => {
  return (
    <div class="flex flex-col h-screen">
      <div class="flex h-screen w-full overflow-hidden">
        <Navigation />
        <Header>{props.children}</Header>
      </div>
    </div>
  );
};

export default App;
