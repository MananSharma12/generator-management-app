/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import App from "./App";
import { NotFound } from "./components/NotFound.tsx";

render(
  () => (
    <Router root={App}>
      <Route path="*" component={NotFound} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
