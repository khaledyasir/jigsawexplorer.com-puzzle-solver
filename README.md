# Jigsaw Explorer Puzzle Solver (Emergency Use Only)

A browser console script for [Jigsaw Explorer](https://www.jigsawexplorer.com/) that places pieces automatically and **leaves the last piece** so you can place it yourself.

## How to use

1. Open a puzzle and press **F12** to open DevTools, then go to the **Console** tab.
2. Snap at least 2 pieces together by hand. The script builds outward from your largest group.
3. Paste the contents of `emergency-use-only-jigsaw-solver.js` and press **Enter**.
4. Wait. Pieces are placed one at a time. Don't touch the board while it runs.
5. The log ends with `left: <id>`. That's the piece to place by hand.

Refreshing the page wipes the changes, so paste the script again if you reload.

## Settings

`DELAY` (default `400`) is the pause in milliseconds after each placed piece.

## How it works

1. Reads the game's piece list through its internal iterator.
2. Treats the largest snapped group as the finished part of the puzzle.
3. For each loose piece touching that group, it rotates the piece to match its neighbour, moves it to the exact fit with the game's `moveToFit`, then calls `drop()` (the same as releasing a piece with the mouse).
4. Repeats until one piece is left.

## Multiplayer

In a multiplayer room, placing all pieces in a burst changed only the local screen. A pause after each piece let the updates reach the other player. If it doesn't show on their screen, stop (refresh) and increase `DELAY`.

## Limitations

- Relies on Jigsaw Explorer's internal names (`jigexGlobals.modules.player`, `getIterator`, `moveToFit`, `drop`). A site update may break it.
- Needs a group of at least 2 snapped pieces to start.
- Unofficial and not affiliated with Jigsaw Explorer. Use at your own risk.
