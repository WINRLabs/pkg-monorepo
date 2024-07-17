import { useGameControllerBetHistory } from "@winrlabs/api";
import {
  BetHistoryCurrencyList,
  BetHistoryFilter,
  BetHistoryTemplate,
  GameType,
} from "@winrlabs/games";
import { useCurrentAccount, useTokenStore } from "@winrlabs/web3";
import { useMemo, useState } from "react";
const BetHistory = ({ gameType }: { gameType: GameType }) => {
  const [filter, setFilter] = useState<BetHistoryFilter>({
    type: "bets",
  });

  const { address } = useCurrentAccount();

  const defaultParams = {
    game: gameType,
    limit: 10,
  };
  const { data, isLoading } = useGameControllerBetHistory({
    queryParams:
      filter.type === "player"
        ? {
            player: address,
            ...defaultParams,
          }
        : defaultParams,
  });

  const tokens = useTokenStore((s) => s.tokens);

  const mapTokens = useMemo(() => {
    return tokens.reduce((acc, token) => {
      acc[token.address] = {
        icon: token.icon,
        symbol: token.symbol,
      };
      return acc;
    }, {} as BetHistoryCurrencyList);
  }, [tokens]);

  return (
    <BetHistoryTemplate
      betHistory={data || []}
      loading={isLoading}
      onChangeFilter={(filter) => setFilter(filter)}
      currencyList={mapTokens}
    />
  );
};

export default BetHistory;
