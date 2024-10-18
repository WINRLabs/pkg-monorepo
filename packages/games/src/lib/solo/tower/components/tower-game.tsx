import React, { useEffect, useState } from 'react';

import { cn } from '../../../utils/style';
import useTowerGameStore from '../store';
import { TemplateOptions } from './template';

interface Cell {
  isBomb: boolean;
  isClickable: boolean;
  isSelected: boolean;
}

export type TowerGameProps = {
  options?: TemplateOptions;
};

const TowerGame = ({ ...props }: TowerGameProps) => {
  const generateGrid = (): Cell[][] => {
    const grid: Cell[][] = Array.from({ length: 4 }, () =>
      Array.from({ length: 8 }, () => ({
        isBomb: Math.random() < 0.5,
        isClickable: false,
        isSelected: false,
      }))
    );

    for (let i = 0; i < grid.length; i++) {
      // @ts-ignore-next-line
      grid[i][0].isClickable = true;
    }

    return grid;
  };

  const options = { ...props.options };

  const [grid, setGrid] = useState<Cell[][]>(generateGrid);
  const [gameOver, setGameOver] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [autoBetMode, setAutoBetMode] = useState(false);

  const { gameMode } = useTowerGameStore(['gameMode']);

  const handleClick = (row: number, col: number) => {
    if (!grid[row]?.[col]?.isClickable || gameOver) return;

    const newGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, isSelected: true };
        }
        if (colIndex === col + 1) {
          return { ...cell, isClickable: true };
        }
        if (colIndex === col) {
          return { ...cell, isClickable: false };
        }
        return cell;
      })
    );
    if (newGrid[row]?.[col]?.isBomb && !autoBetMode) {
      // Bomb clicked, game over
      setGameOver(true);
      alert('Game Over! You hit a bomb!');
      // Set all cells to not clickable
      const updatedGrid = newGrid.map((rowArr) =>
        rowArr.map((cell) => ({ ...cell, isClickable: false }))
      );
      setGrid(updatedGrid);
    } else {
      setGrid(newGrid);
    }
    setGrid(newGrid);
  };

  const resetGame = () => {
    setGrid(generateGrid());
    setGameOver(false);
  };

  const autoBet = () => {
    const selectedCells = grid.flat().filter((cell) => cell.isSelected);

    // if (selectedCells.length === 8) {
    //   const bombClicked = selectedCells.some((cell) => cell.isBomb);
    //   if (bombClicked) {
    //     setGameOver(true);
    //     alert('Game Over! You hit a bomb!');
    //   } else {
    //     alert('Congratulations! You won!');
    //   }
    // }

    if (selectedCells.length === 8) {
      let playCount = 0;
      const interval = setInterval(() => {
        if (playCount >= 3 || gameOver) {
          clearInterval(interval);
          return;
        }

        selectedCells.forEach((cell, index) => {
          setTimeout(() => {
            const rowIndex = Math.floor(index / 8);
            const colIndex = index % 8;
            handleClick(rowIndex, colIndex);
          }, index * 1000); // Adjust the delay time as needed
        });

        playCount++;
      }, 3000); // Adjust the interval time as needed
    }
  };

  useEffect(() => {
    if (gameOver) {
      const updatedGrid = grid.map((rowArr) =>
        rowArr.map((cell) => ({ ...cell, isClickable: false }))
      );
      setGrid(updatedGrid);
    }
  }, [gameOver]);

  const getBackgroundImage = React.useCallback(
    (rowIndex: number, colIndex: number, grid: Cell[][], gameOver: boolean): string => {
      if (
        grid[rowIndex]?.[colIndex]?.isBomb &&
        grid[rowIndex]?.[colIndex]?.isSelected &&
        gameOver
      ) {
        return `url(${options.scene?.bombCell})`;
      } else if (grid[rowIndex]?.[colIndex]?.isBomb && gameOver) {
        return `url(${options.scene?.cellBomb})`;
      } else if (
        !grid[rowIndex]?.[colIndex]?.isBomb &&
        gameOver &&
        !grid[rowIndex]?.[colIndex]?.isSelected
      ) {
        return `url(${options.scene?.cellCoin})`;
      } else if (grid[rowIndex]?.[colIndex]?.isSelected) {
        return `url(${options.scene?.selectedCell})`;
      } else if (!grid[rowIndex]?.[colIndex]?.isClickable) {
        return `url(${options.scene?.cell})`;
      } else if (hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex) {
        return `url(${options.scene?.cellHover})`;
      } else if (grid[rowIndex]?.[colIndex]?.isClickable) {
        return `url(${options.scene?.hoverRowCell})`;
      }
      return '';
    },
    [options.scene, hoveredCell, gameOver]
  );

  return (
    <div className=" wr-w-full wr-h-full wr-relative">
      <img
        src={options.scene?.backgroundImage}
        alt="background"
        className="wr-w-full wr-h-full  wr-absolute wr-z-10"
      />
      <div className="lg:wr-mb-3"></div>
      <div className="wr-flex wr-flex-col wr-items-center  wr-justify-center wr-h-full wr-z-20 wr-relative ">
        <div
          className="wr-grid wr-grid-rows-8 wr-gap-4 wr-p-6"
          style={{ backgroundImage: `url(${options.scene?.gameBg})` }}
        >
          {grid[0]?.map((_, colIndex) => (
            <div
              key={colIndex}
              className="wr-grid wr-grid-cols-4 wr-gap-2 wr-relative"
              style={{ order: -colIndex }}
            >
              {grid.map((_, rowIndex) => {
                return (
                  <button
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      backgroundImage: getBackgroundImage(rowIndex, colIndex, grid, gameOver),
                      transition: 'background-image 0.3s ease-in-out',
                    }}
                    className="wr-w-[68px] wr-z-10 wr-h-9 wr-grid wr-place-items-center wr-bg-no-repeat wr-bg-center wr-bg-contain wr-text-white wr-font-bold wr-transition-all wr-duration-300 wr-relative"
                    onClick={() => handleClick(rowIndex, colIndex)}
                    disabled={!grid[rowIndex]?.[colIndex]?.isClickable}
                  ></button>
                );
              })}
              <div className="wr-absolute wr-inset-0 wr-flex wr-items-center wr-justify-center">
                <span
                  className={cn(
                    'wr-absolute wr-text-sm -wr-top-5 wr-w-14 wr-grid wr-place-items-center wr-h-8 wr-z-20 wr-bg-onyx-800 wr-rounded-full wr-p-1.5',
                    {
                      'wr-border-[#FFD000] wr-border-2': grid.some(
                        (row, rowIndex) =>
                          row[colIndex]?.isClickable && !grid[rowIndex]?.[colIndex]?.isSelected
                      ),
                    }
                  )}
                >
                  15
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="wr-mt-4 wr-w-max wr-z-20 wr-shrink-0 wr-px-4 wr-py-2 wr-bg-blue-500 wr-text-white wr-font-bold wr-rounded-md hover:wr-bg-blue-700"
        onClick={resetGame}
      >
        Reset Game
      </button>

      <button
        onClick={() => setAutoBetMode(!autoBetMode)}
        className="wr-mt-4 wr-w-max wr-z-20 wr-ml-5 wr-shrink-0 wr-px-4 wr-py-2 wr-bg-blue-500 wr-text-white wr-font-bold wr-rounded-md hover:wr-bg-blue-700"
      >
        {autoBetMode ? 'Auto Bet' : 'Manuel Bet'}
      </button>

      {autoBetMode && (
        <button
          onClick={autoBet}
          className="wr-mt-4 wr-w-max wr-z-20 wr-ml-5 wr-shrink-0 wr-px-4 wr-py-2 wr-bg-blue-500 wr-text-white wr-font-bold wr-rounded-md hover:wr-bg-blue-700"
        >
          Play autobet
        </button>
      )}

      {gameMode}
    </div>
  );
};

export default TowerGame;
