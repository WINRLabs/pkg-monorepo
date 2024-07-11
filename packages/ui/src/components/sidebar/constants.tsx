import {
  BaccaratIcon,
  CoinflipIcon,
  CrashIcon,
  DiceIcon,
  HorseRacingIcon,
  KenoIcon,
  LimboIcon,
  MinesIcon,
  PlinkoIcon,
  RangeIcon,
  RouletteIcon,
  RpsIcon,
  SweetBonanzaIcon,
  VideoPokerIcon,
  WheelIcon,
} from "../../svgs";

export const sections = ["originals", "table", "slots", "unity"];

export const originalGames = [
  {
    label: "1-Hand Blackjack",
    href: "/one-hand-blackjack",
    isNew: true,
    icon: <VideoPokerIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Plinko",
    href: "/plinko-2d",
    icon: <PlinkoIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Mines",
    href: "/mines",
    icon: <MinesIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Dice",
    href: "/dice",
    icon: <RangeIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Limbo",
    href: "/limbo",
    icon: <LimboIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Coin Flip",
    href: "/coin-flip-2d",
    icon: <CoinflipIcon className="wr-h-5 wr-w-5" />,
    isNew: true,
  },
  {
    label: "Wheel",
    href: "/wheel",
    icon: <WheelIcon className="wr-h-5 wr-w-5" />,
    isNew: false,
  },
  {
    label: "Keno",
    href: "/keno",
    icon: <KenoIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "RPS",
    href: "/rps",
    icon: <RpsIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Roll",
    href: "/roll",
    icon: <DiceIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Crash",
    href: "/crash",
    icon: <CrashIcon className="wr-h-5 wr-w-5" />,
  },
];

export const tableGames = [
  {
    label: "Blackjack",
    href: "/blackjack",
    isNew: false,
    icon: <VideoPokerIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Roulette",
    href: "/roulette",
    isNew: false,
    icon: <RouletteIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Baccarat",
    href: "/baccarat",
    icon: <BaccaratIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Video Poker",
    href: "/video-poker",
    icon: <VideoPokerIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Holdem Poker",
    href: "/holdem-poker",
    isNew: true,
    icon: <VideoPokerIcon className="wr-h-5 wr-w-5" />,
  },
];

export const slotGames = [
  {
    label: "WINR Bonanza",
    href: "/winr-bonanza",
    isNew: true,
    icon: <SweetBonanzaIcon className="wr-h-5 wr-w-5" />,
  },
];

export const unityGames = [
  {
    label: "Plinko",
    href: "/plinko",
    icon: <PlinkoIcon className="wr-h-5 wr-w-5" />,
    isNew: false,
  },
  {
    label: "Coin Flip",
    href: "/coin-flip",
    icon: <CoinflipIcon className="wr-h-5 wr-w-5" />,
  },
  {
    label: "Horse Race",
    href: "/horse-race",
    icon: <HorseRacingIcon className="wr-h-5 wr-w-5" />,
  },
];

export const accordionSections = [
  {
    value: "originals",
    label: "Originals",
    games: originalGames,
  },
  {
    value: "table",
    label: "Table",
    games: tableGames,
  },
  {
    value: "slots",
    label: "Slots",
    games: slotGames,
  },
  {
    value: "unity",
    label: "Unity",
    games: unityGames,
  },
];
