import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // ✅ Debugging Tool
import TradeDashboard from "./pages/TradeDashboard";

// Create a QueryClient instance with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Avoid unnecessary refetching when switching tabs
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TradeDashboard />
    
    </QueryClientProvider>
  );
}

export default App;
