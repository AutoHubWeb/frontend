import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";
import { WelcomeModal } from "@/components";

function App() {
  return (
    <AppProviders>
      <WelcomeModal />
      <AppRouter />
    </AppProviders>
  );
}

export default App;
