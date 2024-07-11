// Import necessary modules and types
import {
  CHAIN_NAMESPACES,
  IProvider,
  IWeb3AuthCoreOptions,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  CUSTOM_LOGIN_PROVIDER_TYPE,
  LOGIN_PROVIDER_TYPE,
  OpenloginAdapter,
  OpenloginAdapterOptions,
} from "@web3auth/openlogin-adapter";
import { CreateConnectorFn } from "wagmi";
import { Chain } from "wagmi/chains";

import { Web3AuthConnector } from "../utils/web3-auth";

interface Web3AuthConnectorInstanceParams {
  chains: Chain[];
  loginProviders: (LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE)[];
  web3AuthOptions: IWeb3AuthCoreOptions;
  openLoginOptions: OpenloginAdapterOptions;
}

interface Connectors {
  connector: CreateConnectorFn<IProvider>;
  loginProvider: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE;
}

export const SmartWalletConnectorWagmiType = "Web3Auth";

export class SmartWalletConnectors {
  private chains: Chain[];
  private loginProviders: (LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE)[];
  private web3AuthOptions: IWeb3AuthCoreOptions;
  private openLoginOptions: OpenloginAdapterOptions;

  public connectors: Connectors[];

  constructor({
    chains,
    loginProviders,
    web3AuthOptions,
    openLoginOptions,
  }: Web3AuthConnectorInstanceParams) {
    this.chains = chains;
    this.loginProviders = loginProviders;
    this.web3AuthOptions = web3AuthOptions;
    this.openLoginOptions = openLoginOptions;
    this.connectors = this.createConnectors();
  }

  private createConnectorInstance(
    loginProvider: LOGIN_PROVIDER_TYPE | CUSTOM_LOGIN_PROVIDER_TYPE
  ) {
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x" + this.chains?.[0]?.id.toString(16),
      rpcTarget: this.chains?.[0]?.rpcUrls.default.http[0] || "",
      displayName: this.chains?.[0]?.name,
      tickerName: this.chains?.[0]?.nativeCurrency?.name,
      ticker: this.chains?.[0]?.nativeCurrency?.symbol,
      blockExplorerUrl: this.chains?.[0]?.blockExplorers?.default
        .url[0] as string,
    };

    const privateKeyProvider = new EthereumPrivateKeyProvider({
      config: { chainConfig },
    });

    const web3AuthInstance = new Web3AuthNoModal({
      chainConfig,

      ...this.web3AuthOptions,
    });

    const openloginAdapter = new OpenloginAdapter({
      privateKeyProvider,

      ...this.openLoginOptions,
    });

    web3AuthInstance.configureAdapter(openloginAdapter);

    return Web3AuthConnector({
      web3AuthInstance,
      loginParams: {
        loginProvider,
      },
    });
  }

  private createConnectors() {
    return this.loginProviders.map((loginProvider) => {
      const connector = this.createConnectorInstance(
        loginProvider
      ) as unknown as CreateConnectorFn<IProvider>;

      return {
        connector,
        loginProvider,
      };
    });
  }
}
