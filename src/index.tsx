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
import { NotFound } from "~/pages/NotFound.tsx";
import { ProtectedRoute } from "~/components/ProtectedRoute.tsx";

render(
  () => (
    <Router>
      <Route path="/" component={App}>
        <Route
          path="/"
          component={() => (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/customers"
          component={() => (
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/generators"
          component={() => (
            <ProtectedRoute>
              <Generators />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/generators/:customerId"
          component={() => (
            <ProtectedRoute>
              <Generators />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/warranty"
          component={() => (
            <ProtectedRoute>
              <Warranty />
            </ProtectedRoute>
          )}
        />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
);
