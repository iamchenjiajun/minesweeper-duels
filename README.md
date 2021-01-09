## Inspiration
Minesweeper is lots of fun, but there really isn't an easy way to **dynamically battle** against another person to pit your skills against each other. You could compare your average solve time, but that is just by-the-numbers and boring.

What if we could turn Minesweeper into a **fast-paced**, edge-of-your-seat, **constantly evolving** struggle of wits?

## What it does
Minesweeper Duels is a **2 player game** where each player takes turns to reveal a space in the Minesweeper board. However, each player only has a limited amount of time, where it **ticks down during your turn**. Clicking on a mine deducts additional time.

## Quick User Guide

### Creating and joining rooms

Click on "create room" to create a room, and send the code to your friend! Your friend can enter the code on the main page and click on "join room" to join!

### Starting the game

Once your friend joins the room, the minesweeper grid appears in the middle of your screen. Click on a square to start the game.

### Gameplay

- The goal of the game is to run your opponent out of time, or to complete the board (open all the safe squares) with more time remaining than your opponent.
- You take turns to open squares on the board, and your timer runs on your turn.
- A time penalty would be given when you click on a mine.
- You can right-click on squares to flag them, but your opponent would not see the flags.

## How we built it
Using node.js, socket.io, expressJS, JavaScript, HTML and CSS.

## Challenges we ran into
The turn timer was really **tricky to implement**. This is because we had to take into account the latency between the player and the server, in addition to the timers being disjoint. This led us having to come up with some tricky logic to start and pause the timers.

## Accomplishments that we're proud of

Make a working version of the Minesweeper program and adding our own spin to it.

Making a real time multiplayer browser game.

## What we learned

node.js was a new framework to some of our members, and we had to pick it up as we went.

How socketIO sends and waits for messages between client and server.

## What's next for Minesweeper-duels

A battle royale mode involving 4 players in one room.

Implementing **power-ups**, where they would spawn based on each player's elapsed time, making intentionally taking more time a more interesting strategy.

A harder mode, perhaps using emojis instead of numbers where you have to figure out which emojis are mapped to which numbers.

Custom rooms with **customisable** rules.