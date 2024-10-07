import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'debounce';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { GameContainer, SceneContainer } from '../../../common/containers';
import { WinAnimation } from '../../../common/win-animation';
import { useGameOptions } from '../../../game-provider';
import { useStrategist } from '../../../hooks/use-strategist';
import { Form } from '../../../ui/form';
import { parseToBigInt } from '../../../utils/number';
import { toDecimals } from '../../../utils/web3';
import { Mines } from '..';
import { initialBoard, MINES_MODES } from '../constants';
import mineMultipliers from '../constants/mines-multipliers.json';
import { MinesTheme, MinesThemeProvider } from '../provider/theme';
import { useMinesGameStateStore } from '../store';
import { FormSetValue, MINES_GAME_STATUS, MinesFormField, MinesGameResult } from '../types';
import { MinesGameProps } from './game';

type TemplateProps = MinesGameProps & {
  minWager?: number;
  maxWager?: number;
  onSubmitGameForm: (data: MinesFormField) => void;
  onFormChange?: (fields: MinesFormField) => void;
  formSetValue?: FormSetValue;
  onLogin?: () => void;
  onError?: (error: string) => void;
  gameResults: MinesGameResult[];
  theme?: Partial<MinesTheme>;
};

const MinesTemplate = ({ ...props }: TemplateProps) => {
  const { board, gameStatus, updateMinesGameState } = useMinesGameStateStore([
    'board',
    'gameStatus',
    'updateMinesGameState',
  ]);
  // TODO: move it into the store, check refs
  const [isAutoBetMode, setIsAutoBetMode] = React.useState(false);
  const [mode, setMode] = React.useState<(typeof MINES_MODES)[keyof typeof MINES_MODES]>(
    MINES_MODES.MANUAL
  );

  const formSchema = z.object({
    wager: z
      .number()
      .min(props?.minWager || 0.01, {
        message: `Minimum wager is $${props?.minWager}`,
      })
      .max(props?.maxWager || 2000, {
        message: `Maximum wager is $${props?.maxWager}`,
      }),
    minesCount: z.number().max(24).min(1),
    selectedCells: z.array(z.boolean()).length(25),
    betCount: z.number().min(0, { message: 'Minimum bet count is 0' }),
    stopGain: z.number(),
    stopLoss: z.number(),
    increaseOnWin: z.number(),
    increaseOnLoss: z.number(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema, {
      async: true,
    }),
    mode: 'all',
    defaultValues: {
      wager: 1,
      minesCount: 1,
      selectedCells: initialBoard.map((mine) => mine.isSelected),
      betCount: 0,
      stopGain: 0,
      stopLoss: 0,
      increaseOnWin: 0,
      increaseOnLoss: 0,
    },
  });

  const selectedCells = form.watch('selectedCells');

  const minesCount = form.watch('minesCount');

  const _wager = form.watch('wager');

  const currentMultiplier = React.useMemo(() => {
    const multiplier =
      mineMultipliers.find(
        (val) =>
          val.numOfMines === minesCount &&
          val.reveal === selectedCells.filter((val) => val === true).length
      )?.multiplier || 0;

    return toDecimals(Number(multiplier) / 10000, 2);
  }, [selectedCells, minesCount]);

  const currentCashoutAmount = React.useMemo(() => {
    const currentScheme = mineMultipliers.filter((scheme) => scheme.numOfMines === minesCount);

    const currentRevealAmount = currentScheme.find(
      (scheme) => scheme.reveal === board.filter((val) => val.isRevealed === true).length
    );

    const currentMultiplier = toDecimals(Number(currentRevealAmount?.multiplier) || 0, 2);

    return toDecimals((_wager * currentMultiplier) / 10000, 2);
  }, [board, minesCount, _wager]);

  React.useEffect(() => {
    const debouncedCb = debounce((formFields) => {
      props?.onFormChange && props.onFormChange(formFields);
    }, 400);

    const subscription = form.watch(debouncedCb);

    return () => subscription.unsubscribe();
  }, [form.watch]);

  React.useEffect(() => {
    if (!props.formSetValue) return;

    form.setValue(props.formSetValue.key, props.formSetValue.value);
  }, [props.formSetValue]);

  React.useEffect(() => {
    if (mode === MINES_MODES.AUTO) return;

    setTimeout(() => {
      const values = form.getValues();

      if (values.selectedCells.some((c) => c === true && gameStatus !== MINES_GAME_STATUS.ENDED))
        props.onSubmitGameForm(values);
    });
  }, [form.getValues('selectedCells')]);

  React.useEffect(() => {
    if (gameStatus == MINES_GAME_STATUS.ENDED) {
      const won = !board.some((v) => v.isBomb == true);
      props.onAnimationCompleted &&
        props.onAnimationCompleted({
          won,
          currentCashoutAmount,
          currentMultiplier,
        });
    }
  }, [gameStatus]);

  React.useEffect(() => {
    updateMinesGameState({
      board: initialBoard,
    });
  }, [mode]);

  const wager = form.watch('wager');
  const increasePercentageOnWin = form.watch('increaseOnWin');
  const increasePercentageOnLoss = form.watch('increaseOnLoss');
  const stopProfit = form.watch('stopGain');
  const stopLoss = form.watch('stopLoss');

  const strategist = useStrategist({
    wager,
    increasePercentageOnLoss,
    increasePercentageOnWin,
    stopLoss,
    stopProfit,
    isAutoBetMode,
  });
  const { account } = useGameOptions();
  const balanceAsDollar = account?.balanceAsDollar || 0;

  const processStrategy = () => {
    const isWon = !board.some((v) => v.isBomb == true);
    const payout = isWon ? currentCashoutAmount : 0;

    const p = strategist.process(parseToBigInt(wager, 8), parseToBigInt(payout, 8));
    const newWager = Number(p.wager) / 1e8;
    const currentBalance = balanceAsDollar - wager + payout;

    if (currentBalance < wager) {
      setIsAutoBetMode(false);
      props?.onError &&
        props.onError(`Oops, you are out of funds. \n Deposit more funds to continue playing.`);
      return;
    }

    if (newWager < (props.minWager || 0)) {
      form.setValue('wager', props.minWager || 0);
      return;
    }

    if (newWager > (props.maxWager || 0)) {
      form.setValue('wager', props.maxWager || 0);
      return;
    }

    if (p.action && !p.action.isStop()) {
      form.setValue('wager', newWager);
    }

    if (p.action && p.action.isStop()) {
      setIsAutoBetMode(false);
      return;
    }
  };

  return (
    <MinesThemeProvider theme={props.theme || {}}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(props.onSubmitGameForm)}>
          <GameContainer>
            <Mines.Game
              {...props}
              processStrategy={processStrategy}
              isAutoBetMode={isAutoBetMode}
              onAutoBetModeChange={setIsAutoBetMode}
            >
              <Mines.Controller
                {...props}
                currentCashoutAmount={currentCashoutAmount}
                maxWager={props?.maxWager || 2000}
                minWager={props?.minWager || 2}
                currentMultiplier={currentMultiplier}
                isAutoBetMode={isAutoBetMode}
                onAutoBetModeChange={setIsAutoBetMode}
                mode={mode}
                onModeChange={setMode}
                onGameSubmit={props.onSubmitGameForm}
              />
              <SceneContainer className="lg:wr-h-[740px] lg:wr-py-10 max-lg:!wr-border-0 max-lg:!wr-p-0 max-md:wr-bg-transparent">
                <Mines.Scene
                  currentMultiplier={currentMultiplier}
                  isLoading={props.isLoading}
                  isAutoBetMode={isAutoBetMode}
                />
                <WinAnimation />
              </SceneContainer>
            </Mines.Game>
          </GameContainer>
        </form>
      </Form>
    </MinesThemeProvider>
  );
};

export default MinesTemplate;
