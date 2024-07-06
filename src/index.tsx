/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import App from "./App";
import { Dashboard } from "~/pages/Dashboard.tsx";
import { Customers } from "~/pages/Customers.tsx";
import { Generators } from "~/pages/Generators.tsx";
import { Warranty } from "~/pages/Warranty.tsx";
import { Login } from "~/pages/Login.tsx";
import { SignUp } from "~/pages/SignUp.tsx";
import { NotFound } from "./components/NotFound.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

render(
  () => (
    <Router root={App}>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <ProtectedRoute>
        <Route path="/" component={Dashboard} />
        <Route path="/customers" component={Customers} />
        <Route path="/generators" component={Generators} />
        <Route path="/generators/:customerId" component={Generators} />
        <Route path="/warranty" component={Warranty} />
      </ProtectedRoute>
      <Route path="*" component={NotFound} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
