// Space Adventure Game - JavaScript Implementation

// Item Class - Represents objects the player can collect and use
class Item {
    constructor(id, name, description, isUsable = false, isEquippable = false) {
        this.id = id; // Unique identifier for the item
        this.name = name; // Display name of the item
        this.description = description; // Text description of the item
        this.isUsable = isUsable; // Can the item be used?
        this.isEquippable = isEquippable; // Can the item be equipped?
    }
    
    // Get the item's description
    getDescription() {
        return this.description;
    }
    
    // Use the item (to be overridden by specific item types)
    use(player) {
        return `You can't use the ${this.name} right now.`;
    }
}

// Creature Class - Represents creatures in the game
class Creature {
    constructor(id, name, description, health, damage, isHostile = true) {
        this.id = id; // Unique identifier for the creature
        this.name = name; // Display name of the creature
        this.description = description; // Text description of the creature
        this.health = health; // Current health points
        this.maxHealth = health; // Maximum health points
        this.damage = damage; // Damage dealt in combat
        this.isHostile = isHostile; // Is the creature hostile to the player?
        this.isAlive = true; // Is the creature alive?
    }
    
    // Attack the player
    attack(player) {
        if (!this.isAlive || !this.isHostile) return;
        
        const damageDealt = Math.floor(Math.random() * this.damage) + 1;
        player.takeDamage(damageDealt);
        return `${this.name} attacks you for ${damageDealt} damage!`;
    }
    
    // Take damage from player
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
            return true; // Creature died
        }
        return false; // Creature survived
    }
    
    // Get creature status
    checkStatus() {
        if (!this.isAlive) return `${this.name} is dead.`;
        return `${this.name} (Health: ${this.health}/${this.maxHealth})`;
    }
    
    // Get creature description
    getDescription() {
        return this.description;
    }
}

// Room Class - Represents locations in the game
class Room {
    constructor(id, name, description, image) {
        this.id = id; // Unique identifier for the room
        this.name = name; // Display name of the room
        this.description = description; // Text description of the room
        this.image = image; // Image for the room
        this.items = []; // Items in the room
        this.creatures = []; // Creatures in the room
        this.exits = {}; // Exits to other rooms (north, south, east, west)
        this.isVisited = false; // Has the player visited this room before?
    }
    
    // Get room description
    getDescription() {
        let desc = `<span class="location-name">${this.name}</span>\n\n${this.description}`;
        
        // Add items in the room
        if (this.items.length > 0) {
            desc += "\n\nYou see: ";
            const itemNames = this.items.map(item => `<span class="item-name">${item.name}</span>`).join(", ");
            desc += itemNames;
        }
        
        // Add creatures in the room
        if (this.creatures.length > 0) {
            desc += "\n\nCreatures: ";
            const creatureNames = this.creatures.map(creature => 
                `<span class="creature-name">${creature.name}</span>`).join(", ");
            desc += creatureNames;
        }
        
        // Add available exits
        const exitDirections = Object.keys(this.exits);
        if (exitDirections.length > 0) {
            desc += "\n\nExits: " + exitDirections.join(", ");
        } else {
            desc += "\n\nThere are no obvious exits.";
        }
        
        return desc;
    }
    
    // Get available exits
    getExits() {
        return Object.keys(this.exits);
    }
    
    // Add an item to the room
    addItem(item) {
        this.items.push(item);
    }
    
    // Remove an item from the room
    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }
    
    // Add a creature to the room
    addCreature(creature) {
        this.creatures.push(creature);
    }
    
    // Remove a creature from the room
    removeCreature(creatureId) {
        const index = this.creatures.findIndex(creature => creature.id === creatureId);
        if (index !== -1) {
            return this.creatures.splice(index, 1)[0];
        }
        return null;
    }
    
    // Get an item by ID
    getItem(itemId) {
        return this.items.find(item => item.id === itemId);
    }
    
    // Get a creature by ID
    getCreature(creatureId) {
        return this.creatures.find(creature => creature.id === creatureId);
    }
    
    // Get a creature by name
    getCreatureByName(name) {
        return this.creatures.find(creature => 
            creature.name.toLowerCase() === name.toLowerCase());
    }
}

// Player Class - Represents the player character
class Player {
    constructor(startingRoom) {
        this.health = 100; // Current health points
        this.maxHealth = 100; // Maximum health points
        this.inventory = []; // Items the player is carrying
        this.currentLocation = startingRoom; // Current room ID
        this.isAlive = true; // Is the player alive?
    }
    
    // Move to a new room
    move(direction, gameEngine) {
        const currentRoom = gameEngine.getRoom(this.currentLocation);
        if (!currentRoom) return "You're in an unknown location.";
        
        const nextRoomId = currentRoom.exits[direction.toLowerCase()];
        if (!nextRoomId) {
            return `You can't go ${direction} from here.`;
        }
        
        this.currentLocation = nextRoomId;
        const nextRoom = gameEngine.getRoom(this.currentLocation);
        
        // Mark room as visited
        if (nextRoom && !nextRoom.isVisited) {
            nextRoom.isVisited = true;
        }
        
        return nextRoom ? nextRoom.getDescription() : "You move to an unknown location.";
    }
    
    // Take an item from the current room
    take(itemId, gameEngine) {
        const currentRoom = gameEngine.getRoom(this.currentLocation);
        if (!currentRoom) return "You're in an unknown location.";
        
        const item = currentRoom.getItem(itemId);
        if (!item) {
            // Try to find by name
            const itemByName = currentRoom.items.find(i =>
                i.name.toLowerCase() === itemId.toLowerCase());
            if (!itemByName) {
                return `There is no ${itemId} here.`;
            }
            itemId = itemByName.id;
        }
        
        const takenItem = currentRoom.removeItem(itemId);
        if (takenItem) {
            this.inventory.push(takenItem);
            return `You take the ${takenItem.name}.`;
        }
        
        return `You can't take that.`;
    }
    
    // Use an item from inventory
    use(itemId) {
        const item = this.inventory.find(i => 
            i.id === itemId || i.name.toLowerCase() === itemId.toLowerCase());
        
        if (!item) {
            return `You don't have a ${itemId}.`;
        }
        
        if (!item.isUsable) {
            return `You can't use the ${item.name}.`;
        }
        
        return item.use(this);
    }
    
    // Attack a creature in the current room
    attack(creatureName, gameEngine) {
        const currentRoom = gameEngine.getRoom(this.currentLocation);
        if (!currentRoom) return "You're in an unknown location.";
        
        const creature = currentRoom.getCreatureByName(creatureName);
        if (!creature) {
            return `There is no ${creatureName} here.`;
        }
        
        if (!creature.isAlive) {
            return `The ${creatureName} is already dead.`;
        }
        
        if (!creature.isHostile) {
            return `The ${creatureName} is not hostile and doesn't want to fight.`;
        }
        
        // Player attacks creature
        const playerDamage = Math.floor(Math.random() * 15) + 5; // 5-20 damage
        const creatureDied = creature.takeDamage(playerDamage);
        
        let result = `You attack the ${creature.name} for ${playerDamage} damage!`;
        
        if (creatureDied) {
            result += ` The ${creature.name} is dead!`;
            currentRoom.removeCreature(creature.id);
        } else {
            // Creature attacks back
            const counterAttack = creature.attack(this);
            result += "\n" + counterAttack;
        }
        
        return result;
    }
    
    // Take damage
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
    }
    
    // Check player status
    checkStatus() {
        if (!this.isAlive) {
            return "You are dead.";
        }
        return `Health: ${this.health}/${this.maxHealth}`;
    }
    
    // Get inventory
    getInventory() {
        if (this.inventory.length === 0) {
            return "Your inventory is empty.";
        }
        return this.inventory.map(item => item.name).join(", ");
    }
}

// GameEngine Class - Manages the game state and logic
class GameEngine {
    constructor() {
        this.rooms = {}; // All rooms in the game
        this.player = null; // The player object
        this.isGameOver = false; // Is the game over?
        this.isWin = false; // Did the player win?
        this.gameOutput = document.getElementById('game-output'); // Output element
        this.commandInput = document.getElementById('command-input'); // Input element
        this.submitButton = document.getElementById('submit-button'); // Submit button
        this.currentLocationDisplay = document.getElementById('current-location'); // Location display
        this.healthDisplay = document.getElementById('health-status'); // Health display
        this.inventoryDisplay = document.getElementById('inventory'); // Inventory display
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    // Initialize the game world
    initializeGame() {
        this.createRooms();
        this.createItems();
        this.createCreatures();
        this.placeItemsAndCreatures();
        
        // Create player in starting room
        this.player = new Player('crash_site');
        
        // Display starting message
        this.displayMessage("=== ALIEN PLANET SURVIVAL ===\n\n");
        this.displayMessage("Your spaceship has crashed on an unknown alien planet. You must survive the hostile creatures and find a way to call for rescue!\n\n");
        this.displayMessage("Type 'help' for available commands.\n\n");
        
        // Show first room
        const startRoom = this.getRoom(this.player.currentLocation);
        if (startRoom) {
            startRoom.isVisited = true;
            this.displayMessage(startRoom.getDescription());
        }
        
        this.updateStatusDisplays();
    }
    
    // Create all rooms in the game
    createRooms() {
        // Crash Site - Starting location
        this.rooms.crash_site = new Room(
            'crash_site',
            'Crash Site',
            'The smoldering wreckage of your spaceship lies scattered around you. The alien air is thin and cold. Strange purple plants grow in clusters around the metal debris.',
            'assets/crash_site.png'
        );
        
        // Alien Forest
        this.rooms.alien_forest = new Room(
            'alien_forest',
            'Alien Forest',
            'Tall, bioluminescent trees tower above you, their glowing blue leaves casting eerie shadows. The ground is soft and spongy, and you hear strange rustling sounds in the distance.',
            'assets/alien_forest.png'
        );
        
        // Crystal Caves
        this.rooms.crystal_caves = new Room(
            'crystal_caves',
            'Crystal Caves',
            'The walls of this cave are lined with shimmering crystals that pulse with an inner light. The air hums with energy, and you can hear dripping water echoing in the distance.',
            'assets/crystal_caves.png'
        );
        
        // Abandoned Research Facility
        this.rooms.research_facility = new Room(
            'research_facility',
            'Abandoned Research Facility',
            'This once-bustling research facility is now silent and dusty. Broken equipment lines the walls, and computer screens flicker with error messages. Papers and data pads are scattered on the floor.',
            'assets/research_facility.png'
        );
        
        // Mountain Peak
        this.rooms.mountain_peak = new Room(
            'mountain_peak',
            'Mountain Peak',
            'You stand at the highest point of the alien mountain range. The view is breathtaking - you can see the entire alien landscape spread out below. The wind howls fiercely at this altitude.',
            'assets/mountain_peak.png'
        );
        
        // Underground Tunnels
        this.rooms.underground_tunnels = new Room(
            'underground_tunnels',
            'Underground Tunnels',
            'These dark, narrow tunnels wind deep beneath the planet\'s surface. The air is damp and musty, and strange markings cover the walls.',
            'assets/underground_tunnels.png'
        );
        
        // Connect rooms with exits
        this.rooms.crash_site.exits = { north: 'alien_forest', east: 'crystal_caves' };
        this.rooms.alien_forest.exits = { south: 'crash_site', east: 'mountain_peak', west: 'underground_tunnels' };
        this.rooms.crystal_caves.exits = { west: 'crash_site', north: 'research_facility' };
        this.rooms.research_facility.exits = { south: 'crystal_caves', east: 'mountain_peak' };
        this.rooms.mountain_peak.exits = { west: 'alien_forest', south: 'research_facility' };
        this.rooms.underground_tunnels.exits = { east: 'alien_forest', north: 'crystal_caves' };
    }
    
    // Create all items in the game
    createItems() {
        // Basic items
        this.items = {
            medkit: new Item(
                'medkit',
                'Medkit',
                'A medical kit that can restore health.',
                true,
                false
            ),
            energy_bar: new Item(
                'energy_bar',
                'Energy Bar',
                'A high-energy food bar that restores a small amount of health.',
                true,
                false
            ),
            flashlight: new Item(
                'flashlight',
                'Flashlight',
                'A sturdy flashlight that can illuminate dark areas.',
                true,
                false
            ),
            knife: new Item(
                'knife',
                'Combat Knife',
                'A sharp combat knife that increases your damage in combat.',
                false,
                true
            ),
            keycard: new Item(
                'keycard',
                'Research Facility Keycard',
                'A keycard that grants access to the research facility.',
                false,
                false
            ),
            battery: new Item(
                'battery',
                'Power Battery',
                'A high-capacity battery that can power electronic devices.',
                true,
                false
            ),
            beacon: new Item(
                'beacon',
                'Rescue Beacon',
                'A distress beacon that can call for rescue when activated at the mountain peak.',
                true,
                false
            ),
            crystal: new Item(
                'crystal',
                'Energy Crystal',
                'A glowing crystal that hums with power. It might be useful for repairing equipment.',
                false,
                false
            ),
            datapad: new Item(
                'datapad',
                'Research Datapad',
                'A datapad containing research notes about the alien planet.',
                false,
                false
            )
        };
        
        // Set up item use functions
        this.items.medkit.use = function(player) {
            const healAmount = 50;
            player.health = Math.min(player.health + healAmount, player.maxHealth);
            return `<span class="success-text">You use the medkit and restore ${healAmount} health.</span>`;
        };
        
        this.items.energy_bar.use = function(player) {
            const healAmount = 20;
            player.health = Math.min(player.health + healAmount, player.maxHealth);
            return `<span class="success-text">You eat the energy bar and restore ${healAmount} health.</span>`;
        };
        
        this.items.flashlight.use = function(player) {
            return `<span class="info-text">You turn on the flashlight. The beam cuts through the darkness.</span>`;
        };
        
        this.items.battery.use = function(player) {
            // Check if player has the beacon
            const hasBeacon = player.inventory.some(item => item.id === 'beacon');
            if (hasBeacon) {
                return `<span class="success-text">You install the battery in the beacon. It's now ready to activate!</span>`;
            }
            return `<span class="warning-text">You have nothing to use the battery with.</span>`;
        };
        
        this.items.beacon.use = function(player) {
            // Check if player is at mountain peak
            if (player.currentLocation === 'mountain_peak') {
                // Check if beacon has battery
                const hasBattery = player.inventory.some(item => item.id === 'battery');
                if (hasBattery) {
                    gameEngine.isWin = true;
                    gameEngine.isGameOver = true;
                    return `<span class="success-text">You activate the rescue beacon! A signal shoots into the sky... Rescue is on the way! YOU WIN!</span>`;
                } else {
                    return `<span class="warning-text">The beacon needs power. You need to find a battery first.</span>`;
                }
            } else {
                return `<span class="warning-text">You need to be at the mountain peak to activate the beacon effectively.</span>`;
            }
        };
    }
    
    // Create all creatures in the game
    createCreatures() {
        this.creatures = {
            xenomorph: new Creature(
                'xenomorph',
                'Xenomorph',
                'A terrifying alien creature with sharp claws and dripping fangs. It moves with unnatural speed.',
                50,
                15,
                true
            ),
            alien_beast: new Creature(
                'alien_beast',
                'Alien Beast',
                'A large, six-legged creature with tough hide and powerful jaws. It looks hungry.',
                70,
                10,
                true
            ),
            swarm: new Creature(
                'swarm',
                'Alien Swarm',
                'A swarm of small, flying alien creatures that move as one. Individually weak, but dangerous in numbers.',
                30,
                8,
                true
            ),
            friendly_alien: new Creature(
                'friendly_alien',
                'Peaceful Alien',
                'A small, timid creature with large eyes. It seems curious rather than hostile.',
                20,
                0,
                false
            )
        };
    }
    
    // Place items and creatures in rooms
    placeItemsAndCreatures() {
        // Place items
        this.rooms.crash_site.addItem(this.items.flashlight);
        this.rooms.crash_site.addItem(this.items.energy_bar);
        
        this.rooms.alien_forest.addItem(this.items.medkit);
        this.rooms.alien_forest.addCreature(this.creatures.xenomorph);
        
        this.rooms.crystal_caves.addItem(this.items.crystal);
        this.rooms.crystal_caves.addCreature(this.creatures.swarm);
        
        this.rooms.research_facility.addItem(this.items.keycard);
        this.rooms.research_facility.addItem(this.items.datapad);
        this.rooms.research_facility.addItem(this.items.battery);
        this.rooms.research_facility.addCreature(this.creatures.alien_beast);
        
        this.rooms.mountain_peak.addItem(this.items.beacon);
        
        this.rooms.underground_tunnels.addItem(this.items.knife);
        this.rooms.underground_tunnels.addCreature(this.creatures.friendly_alien);
    }
    
    // Get a room by ID
    getRoom(roomId) {
        return this.rooms[roomId] || null;
    }
    
    // Process player commands
    processCommand(command) {
        if (this.isGameOver) {
            return "The game is over. Refresh the page to play again.";
        }
        
        const parts = command.trim().toLowerCase().split(' ');
        const action = parts[0];
        const target = parts.slice(1).join(' ');
        
        let result = '';
        
        switch (action) {
            case 'go':
            case 'move':
            case 'walk':
                if (!target) {
                    result = "Go where? Specify a direction (north, south, east, west).";
                } else {
                    result = this.player.move(target, this);
                }
                break;
                
            case 'look':
            case 'l':
                const currentRoom = this.getRoom(this.player.currentLocation);
                result = currentRoom ? currentRoom.getDescription() : "You're in an unknown location.";
                break;
                
            case 'take':
            case 'get':
                if (!target) {
                    result = "Take what? Specify an item name.";
                } else {
                    result = this.player.take(target, this);
                }
                break;
                
            case 'use':
                if (!target) {
                    result = "Use what? Specify an item name.";
                } else {
                    result = this.player.use(target);
                }
                break;
                
            case 'attack':
            case 'fight':
            case 'hit':
                if (!target) {
                    result = "Attack what? Specify a creature name.";
                } else {
                    result = this.player.attack(target, this);
                }
                break;
                
            case 'inventory':
            case 'inv':
            case 'i':
                result = "Inventory: " + this.player.getInventory();
                break;
                
            case 'status':
            case 'health':
            case 'hp':
                result = "Status: " + this.player.checkStatus();
                break;
                
            case 'help':
            case 'h':
            case '?':
                result = this.getHelpText();
                break;
                
            default:
                result = `I don't understand '${command}'. Type 'help' for available commands.`;
        }
        
        // Check win/lose conditions after processing command
        this.checkGameConditions();
        
        // Update status displays
        this.updateStatusDisplays();
        
        return result;
    }
    
    // Get help text
    getHelpText() {
        return `Available commands:
- go/move/walk [direction] - Move in a direction (north, south, east, west)
- look/l - Look around the current area
- take/get [item] - Pick up an item
- use [item] - Use an item from your inventory
- attack/fight/hit [creature] - Attack a creature
- inventory/inv/i - Check your inventory
- status/health/hp - Check your health status
- help/h/? - Show this help text

Your goal: Survive the alien creatures and find a way to call for rescue!`;
    }
    
    // Check win/lose conditions
    checkGameConditions() {
        // Check lose condition
        if (!this.player.isAlive) {
            this.isGameOver = true;
            this.displayMessage(`<span class="danger-text">You have died! GAME OVER.</span>`);
        }
        
        // Win condition is checked in beacon.use() function
    }
    
    // Update status displays
    updateStatusDisplays() {
        const currentRoom = this.getRoom(this.player.currentLocation);
        if (currentRoom) {
            this.currentLocationDisplay.textContent = currentRoom.name;
            const roomImage = document.getElementById('room-image');
            roomImage.style.opacity = 0;
            setTimeout(() => {
                roomImage.src = currentRoom.image;
                roomImage.style.display = 'block';
                roomImage.style.opacity = 1;
            }, 250);
        } else {
            this.currentLocationDisplay.textContent = 'Unknown';
        }
        this.healthDisplay.textContent = `${this.player.health}/${this.player.maxHealth}`;
        this.inventoryDisplay.textContent = this.player.getInventory();
        this.updateCompass();
        this.updateContextButtons();
    }
    
    // Update context-sensitive buttons
    updateContextButtons() {
        const contextContainer = document.getElementById('context-buttons');
        contextContainer.innerHTML = '';
        
        const currentRoom = this.getRoom(this.player.currentLocation);
        if (!currentRoom) return;
        
        // Add take buttons for items in room
        currentRoom.items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'context-btn take-btn';
            btn.textContent = `📦 Take ${item.name}`;
            btn.addEventListener('click', () => {
                this.displayMessage(`> take ${item.name}`);
                const result = this.processCommand(`take ${item.name}`);
                this.displayMessage(result);
            });
            contextContainer.appendChild(btn);
        });
        
        // Add attack buttons for hostile creatures
        currentRoom.creatures.forEach(creature => {
            if (creature.isHostile && creature.isAlive) {
                const btn = document.createElement('button');
                btn.className = 'context-btn attack-btn';
                btn.textContent = `⚔️ Attack ${creature.name}`;
                btn.addEventListener('click', () => {
                    this.displayMessage(`> attack ${creature.name}`);
                    const result = this.processCommand(`attack ${creature.name}`);
                    this.displayMessage(result);
                });
                contextContainer.appendChild(btn);
            }
        });
        
        // Add use buttons for usable items in inventory
        this.player.inventory.forEach(item => {
            if (item.isUsable) {
                const btn = document.createElement('button');
                btn.className = 'context-btn use-btn';
                btn.textContent = `✨ Use ${item.name}`;
                btn.addEventListener('click', () => {
                    this.displayMessage(`> use ${item.name}`);
                    const result = this.processCommand(`use ${item.name}`);
                    this.displayMessage(result);
                });
                contextContainer.appendChild(btn);
            }
        });
    }
    
    // Display a message in the game output
    displayMessage(message) {
        this.gameOutput.innerHTML += message + '\n\n';
        this.gameOutput.scrollTop = this.gameOutput.scrollHeight;
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Handle form submission
        const submitCommand = () => {
            const command = this.commandInput.value.trim();
            if (command) {
                this.displayMessage(`> ${command}`);
                const result = this.processCommand(command);
                this.displayMessage(result);
                this.commandInput.value = '';
            }
        };
        
        this.submitButton.addEventListener('click', submitCommand);
        this.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitCommand();
            }
        });
        
        // Direction buttons
        const directionButtons = document.querySelectorAll('.direction-btn');
        directionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.dataset.direction;
                this.displayMessage(`> go ${direction}`);
                const result = this.processCommand(`go ${direction}`);
                this.displayMessage(result);
            });
        });
        
        // Action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.displayMessage(`> ${action}`);
                const result = this.processCommand(action);
                this.displayMessage(result);
            });
        });
    }
    
    // Update compass buttons based on available exits
    updateCompass() {
        const currentRoom = this.getRoom(this.player.currentLocation);
        if (!currentRoom) return;
        
        const availableExits = currentRoom.getExits();
        const directions = ['north', 'south', 'east', 'west'];
        
        directions.forEach(dir => {
            const btn = document.querySelector(`.direction-btn.${dir}`);
            if (btn) {
                if (availableExits.includes(dir)) {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }
        });
    }
}

// Initialize the game when the page loads
let gameEngine;
document.addEventListener('DOMContentLoaded', () => {
    gameEngine = new GameEngine();
});