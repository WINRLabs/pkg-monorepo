import { HorseRaceFormFields, HorseRaceTemplate } from "@winrlabs/games";
import {
  useCurrentAccount,
  useTokenAllowance,
  useTokenStore,
} from "@winrlabs/web3";
import { useEffect, useState } from "react";

import { useListenMultiplayerGameEvent } from "../hooks";
import { useContractConfigContext } from "../hooks/use-contract-config";
import { GAME_HUB_GAMES } from "../utils";

type TemplateOptions = {
  scene?: {
    backgroundImage?: string;
  };
};

interface TemplateWithWeb3Props {
  options: TemplateOptions;
  minWager?: number;
  maxWager?: number;

  onAnimationCompleted?: (result: []) => void;
}

const HorseRaceGame = (props: TemplateWithWeb3Props) => {
  const {
    gameAddresses,
    controllerAddress,
    cashierAddress,
    uiOperatorAddress,
  } = useContractConfigContext();
  const selectedToken = useTokenStore((s) => s.selectedToken);
  const selectedTokenAddress = selectedToken.address;

  const [formValues, setFormValues] = useState<HorseRaceFormFields>();
  const gameEvent = useListenMultiplayerGameEvent(GAME_HUB_GAMES.horse_race);

  const currentAccount = useCurrentAccount();

  const allowance = useTokenAllowance({
    amountToApprove: 999,
    owner: currentAccount.address || "0x0000000",
    spender: cashierAddress,
    tokenAddress: selectedTokenAddress,
    showDefaultToasts: false,
  });

  const onGameSubmit = async () => {
    if (!allowance.hasAllowance) {
      const handledAllowance = await allowance.handleAllowance({
        errorCb: (e: any) => {
          console.log("error", e);
        },
      });

      if (!handledAllowance) return;
    }
  };

  useEffect(() => {
    if (!gameEvent) return;

    console.log(gameEvent);
  }, [gameEvent]);

  return (
    <div>
      <HorseRaceTemplate
        {...props}
        currentAccount={currentAccount as `0x${string}`}
        buildedGameUrl={""}
        onSubmitGameForm={onGameSubmit}
        onFormChange={(val) => {
          setFormValues(val);
        }}
      />
    </div>
  );
};

export default HorseRaceGame;
