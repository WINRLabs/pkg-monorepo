import { useGameControllerBetHistory } from "@winrlabs/api";
import {
  BetHistoryFilter,
  BetHistoryTemplate,
  GameType,
} from "@winrlabs/games";
import { useCurrentAccount } from "@winrlabs/web3";
import { useState } from "react";
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

  return (
    <BetHistoryTemplate
      betHistory={data || []}
      loading={isLoading}
      onChangeFilter={(filter) => setFilter(filter)}
    />
  );
};

export default BetHistory;
