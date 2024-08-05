import { CDN_URL } from "../../constants";
import { ChipFixed as Chip } from "./types";

export const renderChipIcon = (w: Chip, width = 35, height = 35) => {
  if (w >= Chip.FIVE)
    return (
      <img
        src={`${CDN_URL}/icons/chips/chip-five.svg`}
        width={width}
        height={height}
        style={{
          maxHeight: `${height}px`,
          maxWidth: `${width}px`,
        }}
        alt="JustBet On-Chain Roulette"
      />
    );
  else if (w >= Chip.FOUR)
    return (
      <img
        src={`${CDN_URL}/icons/chips/chip-four.svg`}
        width={width}
        height={height}
        style={{
          maxHeight: `${height}px`,
          maxWidth: `${width}px`,
        }}
        alt="JustBet On-Chain Roulette"
      />
    );
  else if (w >= Chip.THREE)
    return (
      <img
        src={`${CDN_URL}/icons/chips/chip-three.svg`}
        width={width}
        height={height}
        style={{
          maxHeight: `${height}px`,
          maxWidth: `${width}px`,
        }}
        alt="JustBet On-Chain Roulette"
      />
    );
  else if (w >= Chip.TWO)
    return (
      <img
        src={`${CDN_URL}/icons/chips/chip-two.svg`}
        width={width}
        height={height}
        style={{
          maxHeight: `${height}px`,
          maxWidth: `${width}px`,
        }}
        alt="JustBet On-Chain Roulette"
      />
    );
  else if (w > 0)
    return (
      <img
        src={`${CDN_URL}/icons/chips/chip-one.svg`}
        width={width}
        height={height}
        style={{
          maxHeight: `${height}px`,
          maxWidth: `${width}px`,
        }}
        alt="JustBet On-Chain Roulette"
      />
    );
};
