import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { RouterProvider } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();
const helmetContext = {};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider context={helmetContext}>
            <RouterProvider router={router} />
          </HelmetProvider>
        </QueryClientProvider>
      </JotaiProvider>
      <ToastProvider placement="top-right" />
    </HeroUIProvider>
  </StrictMode>,
);
