# Alien Planet Survival - Text Adventure Game

A space-themed text adventure game built with HTML, CSS, and JavaScript using Object-Oriented Programming principles.

## Game Description

You've crash-landed on a mysterious alien planet! Your mission is to survive hostile creatures, explore different locations, collect useful items, and ultimately find a way to call for rescue.

## How to Play

1. Navigate to the [GitHub Pages site](https://riazmohamed.github.io/text_adv_game/) to play the game
2. Type commands in the input field and press Enter or click the "Go" button
3. Explore the alien planet and find a way to activate the rescue beacon!

## Game Commands

- `go/move/walk [direction]` - Move in a direction (north, south, east, west)
- `look/l` - Look around the current area
- `take/get [item]` - Pick up an item
- `use [item]` - Use an item from your inventory
- `attack/fight/hit [creature]` - Attack a creature
- `inventory/inv/i` - Check your inventory
- `status/health/hp` - Check your health status
- `help/h/?` - Show help text

## Game Locations

- **Crash Site** - Your starting location where your spaceship crashed
- **Alien Forest** - A bioluminescent forest with hostile creatures
- **Crystal Caves** - Caves lined with energy crystals
- **Abandoned Research Facility** - A deserted facility with useful items
- **Mountain Peak** - The highest point where you can activate the rescue beacon
- **Underground Tunnels** - Dark tunnels beneath the planet's surface

## Win Condition

Find the rescue beacon at the mountain peak, power it with a battery from the research facility, and activate it to call for rescue!

## Technical Implementation

This game demonstrates Object-Oriented Programming principles with the following classes:

- **Item Class** - Represents collectible and usable objects
- **Creature Class** - Represents hostile and friendly creatures
- **Room Class** - Represents game locations with items, creatures, and exits
- **Player Class** - Manages player state, inventory, and actions
- **GameEngine Class** - Controls game flow, processes commands, and manages the game world

## Project Structure

```
text_adventure_game/
├── index.html      # Main HTML file
├── styles.css      # CSS styling for space theme
├── game.js         # JavaScript game logic
└── README.md       # This file
```

## How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/riazmohamed/text_adv_game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd text_adventure_game
   ```

3. Open `index.html` in your web browser

## Future Enhancements

- Add more complex puzzles and challenges
- Implement a save/load game feature
- Add sound effects and background music
- Create additional alien creatures with unique behaviors
- Expand the game world with more locations

## Author

Created as part of a coding bootcamp project to demonstrate OOP principles in JavaScript.