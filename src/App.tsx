import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifications from "@/pages/Notifications";
import Faturamento from "@/pages/Faturamento";
import ActiveOrders from "@/pages/ActiveOrders";
import FaturamentoEstabelecimento from "@/pages/FaturamentoEstabelecimento";
import Recebimentos from './pages/Recebimentos';
import Entregas from './pages/Entregas';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/faturamento" element={<Faturamento />} />
              <Route path="/faturamento/estabelecimento/:id" element={<FaturamentoEstabelecimento />} />
              <Route path="/active-orders" element={<ActiveOrders />} />
              <Route path="/recebimentos" element={<Recebimentos />} />
              <Route path="/entregas" element={<Entregas />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
