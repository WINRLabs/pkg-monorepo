import React, { useState } from 'react';

import { cn } from '../../../utils/style';
import { TemplateOptions } from './template';

interface Cell {
  isBomb: boolean;
  isClickable: boolean;
  isSelected: boolean;
}

export type TowerGameProps = {
  options?: TemplateOptions;
};

const generateGrid = (): Cell[][] => {
  // Generate a 3x8 grid with random bomb placements
  const grid: Cell[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 8 }, () => ({
      isBomb: Math.random() < 0.5, // 30% chance of bomb
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

const TowerGame = ({ ...props }: TowerGameProps) => {
  const options = { ...props.options };

  console.log('options', options);

  const [grid, setGrid] = useState<Cell[][]>(generateGrid);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (row: number, col: number) => {
    if (!grid[row]?.[col]?.isClickable || gameOver) return;

    if (grid[row][col].isBomb) {
      // Bomb clicked, game over
      setGameOver(true);
      alert('Game Over! You hit a bomb!');
    } else {
      // Make the next column clickable and disable the current column

      const newGrid = grid.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) => {
          if (colIndex === col + 1) {
            return { ...cell, isClickable: true };
          }
          if (colIndex === col) {
            return { ...cell, isClickable: false };
          }
          return cell;
        })
      );

      // Select the clicked cell
      if (newGrid[row] && newGrid[row][col]) {
        newGrid[row][col].isSelected = true;
      }

      setGrid(newGrid);
    }
  };

  const resetGame = () => {
    setGrid(generateGrid());
    setGameOver(false);
  };

  return (
    <div className=" wr-w-full wr-h-full wr-relative">
      <img
        src={options.scene?.backgroundImage}
        alt="background"
        className="wr-w-full wr-h-full  wr-absolute wr-z-10"
      />
      <div className="lg:wr-mb-3"></div>
      <div className="wr-flex wr-flex-col wr-items-center  wr-z-20 wr-relative ">
        <h1 className="wr-text-2xl wr-font-bold wr-mb-4">Tower Game</h1>
        {gameOver && <div className="wr-text-red-500 wr-font-bold">Game Over!</div>}
        <div className="wr-grid wr-grid-rows-8 wr-gap-4">
          {grid[0]?.map((_, colIndex) => (
            <div
              key={colIndex}
              className="wr-grid wr-grid-cols-3 wr-gap-2"
              style={{ order: -colIndex }}
            >
              {grid.map((_, rowIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'wr-w-44 wr-h-14 wr-rounded-md wr-grid wr-place-items-center wr-text-white wr-font-bold',
                    {
                      'wr-bg-blue-500 hover:wr-bg-blue-700':
                        grid[rowIndex]?.[colIndex]?.isClickable,
                      'wr-bg-zinc-900': !grid[rowIndex]?.[colIndex]?.isClickable,
                      'wr-bg-lime-600': grid[rowIndex]?.[colIndex]?.isSelected,
                      'wr-bg-red-600': grid[rowIndex]?.[colIndex]?.isBomb && gameOver,
                    }
                  )}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  disabled={!grid[rowIndex]?.[colIndex]?.isClickable}
                >
                  {gameOver && grid[rowIndex]?.[colIndex]?.isBomb ? (
                    <img src={options.scene?.bombImage} alt="bomb" width={60} height={60} />
                  ) : grid[rowIndex]?.[colIndex]?.isSelected ? (
                    <img src={options.scene?.gemImage} alt="selected" width={60} height={60} />
                  ) : (
                    <img src={options.scene?.logo} alt="Click Me!" width={40} height={40} />
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
        <button
          className="wr-mt-4 wr-px-4 wr-py-2 wr-bg-blue-500 wr-text-white wr-font-bold wr-rounded-md hover:wr-bg-blue-700"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default TowerGame;
