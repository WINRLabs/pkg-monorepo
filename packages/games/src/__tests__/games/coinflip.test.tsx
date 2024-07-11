// write me a test for the coinflip game keep in mind that it uses game provider

import { render } from "@testing-library/react";

import { GameProvider } from "../../lib/game-provider";
import { CoinFlipTemplate, CoinSide } from "../../lib/solo/coin-flip";

jest.mock("../../lib/solo/coin-flip/components/coin/coin-rotate", () =>
  jest.requireActual("../../test-utils/deepMock").deepMock()
);

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("three", () => {
  const THREE = jest.requireActual("three");
  return {
    ...THREE,
    WebGLRenderer: jest.fn().mockReturnValue({
      domElement: jest.fn(),
      setSize: jest.fn(),
      render: jest.fn(),
      setPixelRatio: jest.fn(),
    }),
  };
});

describe("CoinFlip", () => {
  it("should render the CoinFlip game", () => {
    render(
      <GameProvider
        options={{
          currency: {
            icon: "BNB",
            name: "BNB",
            symbol: "BNB",
          },
          defaults: {
            maxBet: 1,
            maxWager: 1,
            minWager: 0.1,
          },
        }}
      >
        <CoinFlipTemplate
          gameResults={[
            {
              coinSide: CoinSide.HEADS,
              payout: 1.98,
              payoutInUsd: 0.0,
            },
          ]}
          onSubmit={(params) => params}
          options={{
            scene: {
              backgroundImage: "https://via.placeholder.com/1920x1080",
            },
          }}
        />
      </GameProvider>
    );
  });
});
