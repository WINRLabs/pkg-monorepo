import { BundlerNetwork, WinrLabsWeb3Provider } from '@winrlabs/web3';
import { allAddresses, appTokens } from '../../constants';
import { usePriceFeed } from '../hooks/price-feed';

const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || '';
const network = BundlerNetwork.WINR;

export const entryPointAddress = allAddresses.entryPoint;
export const factoryAddress = allAddresses.factory;

export function WinrLabsWeb3Providers(props: { children: React.ReactNode }) {
  const { priceFeed } = usePriceFeed();

  return (
    <WinrLabsWeb3Provider
      bundlerVersion="v2"
      // apiConfig={{
      //   baseUrl: 'https://abc.com',
      // }}
      globalChainId={66666666}
      apiConfig={{}}
      smartAccountConfig={{
        bundlerUrl,
        network,
        entryPointAddress,
        factoryAddress,
        paymasterAddress: '0x37C6F569A0d68C8381Eb501b79F501aDc132c144',
      }}
      tokens={appTokens}
      tokenPriceFeed={priceFeed}
      selectedToken={{
        address: '0xaF31A7E835fA24f13ae1e0be8EB1fb56F906BE11',
        bankrollIndex: '0x0000000000000000000000000000000000000001',
        displayDecimals: 2,
        decimals: 6,
        icon: '/images/tokens/usdc.png',
        symbol: 'USDC',
        playable: true,
        priceKey: 'usdc',
      }}
      onPinNotFound={() => {
        console.log('Pin not found');
      }}
      onLevelUp={() => {
        console.log('Level up');
        return Promise.resolve();
      }}
    >
      {props.children}
    </WinrLabsWeb3Provider>
  );
}
