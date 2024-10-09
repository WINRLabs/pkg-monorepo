import React, { useState } from 'react';

import { cn } from '../../../utils/style';

interface Cell {
  isBomb: boolean;
  isClickable: boolean;
  isSelected: boolean;
}

const generateGrid = (): Cell[][] => {
  // Generate a 3x8 grid with random bomb placements
  const grid: Cell[][] = Array.from({ length: 3 }, () =>
    Array.from({ length: 8 }, () => ({
      isBomb: Math.random() < 0.03, // 30% chance of bomb
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

const TowerGame: React.FC = () => {
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
    <div className="wr-flex wr-flex-col wr-items-center">
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
                  'wr-w-16 wr-h-16 wr-border-2 wr-rounded-md wr-text-white wr-font-bold',
                  {
                    'wr-bg-blue-500 hover:wr-bg-blue-700': grid[rowIndex]?.[colIndex]?.isClickable,
                    'wr-bg-gray-500': !grid[rowIndex]?.[colIndex]?.isClickable,
                    'wr-bg-green-500': grid[rowIndex]?.[colIndex]?.isSelected,
                    'wr-bg-red-500': grid[rowIndex]?.[colIndex]?.isBomb && gameOver,
                  }
                )}
                onClick={() => handleClick(rowIndex, colIndex)}
                disabled={!grid[rowIndex]?.[colIndex]?.isClickable}
              >
                {gameOver && grid[rowIndex]?.[colIndex]?.isBomb ? '💣' : rowIndex + 1}
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
  );
};

export default TowerGame;
