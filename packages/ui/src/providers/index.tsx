import { Config } from "wagmi";

import { AppConfigProvider } from "./app-config";
import { WagmiConfigProvider } from "./wagmi-config";

export const AppUiProviders = ({
  children,
  wagmiConfig,
}: {
  children?: React.ReactNode;
  wagmiConfig: Config;
}) => {
  return (
    <AppConfigProvider>
      <WagmiConfigProvider wagmiConfig={wagmiConfig}>
        {children}
      </WagmiConfigProvider>
    </AppConfigProvider>
  );
};
