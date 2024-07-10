/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { Router, Route, RouteSectionProps } from "@solidjs/router";
import { Component } from "solid-js";

import App from "./App";
import { Dashboard } from "~/pages/Dashboard.tsx";
import { Customers } from "~/pages/Customers.tsx";
import { Generators } from "~/pages/Generators.tsx";
import { Warranty } from "~/pages/Warranty.tsx";
import { Login } from "~/pages/Login.tsx";
import { SignUp } from "~/pages/SignUp.tsx";
import { NotFound } from "~/pages/NotFound.tsx";
import { ProtectedRoute } from "~/components/ProtectedRoute.tsx";

const ProtectedLayout: Component<RouteSectionProps> = (props) => (
  <ProtectedRoute>{props.children}</ProtectedRoute>
);

render(
  () => (
    <Router>
      <Route path="/" component={App}>
        <Route component={ProtectedLayout}>
          <Route path="/" component={Dashboard} />
          <Route path="/customers" component={Customers} />
          <Route path="/generators" component={Generators} />
          <Route path="/generators/:customerId" component={Generators} />
          <Route path="/warranty" component={Warranty} />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
