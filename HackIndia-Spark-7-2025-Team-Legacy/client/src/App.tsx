import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SocialMediaPage from "@/pages/social-media";
import GroundNewsPage from "@/pages/ground-news";
import SatelliteDashboard from "@/pages/satellite-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/ground-news" component={GroundNewsPage}/>
      <Route path="/social-media" component={SocialMediaPage}/>
      <Route path="/satellite-dashboard" component={SatelliteDashboard}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
