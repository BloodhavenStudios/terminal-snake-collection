const readline = require('readline');
const { stdout: out } = require('process');

// Game settings
const game_width = 20;
const game_height = game_width/2;

const pixels = {
    snake_head: "S",
    snake_body: "s",
    apple: "@",
    border: "#",
    empty_space: " "
};

const colors = {
    snake: "\x1b[32m",
    apple: "\x1b[31m",
    border: "\x1b[34m",
    empty_space: "",

    game_over: "\x1b[31m",
    score: "\x1b[32m",
    reset: "\x1b[0m" // Don't change.
};

let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 }; // Moving right
let food = { x: 15, y: 5 };
let speed = 300; // Speed of the game

// Configure Terminal
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// Listen for keypresses
process.stdin.on('keypress', (str, key) => {
    if (key?.name === "q") {
        process.exit(); // Exit the game
    } else {
        switch (key.name) {
            case "up":
            case "w":
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case "down":
            case "s":
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
            case "left":
            case "a":
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case "right":
            case "d":
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
        }
    }
});

// Function to generate a random number based on size of the game
function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create new apple position
function update_apple_pos(x_pos, y_pos) {
    food = {
        x: x_pos,
        y: y_pos
    };
}

// Function to draw the game
function draw_game() {
    // Clear the screen
    process.stdout.write('\x1Bc');
  
    // Draw top border
    out.write(colors.border + pixels.border.repeat(game_width + 2) + "\n");
  
    // Draw main game area with side borders
    for (let y = 0; y < game_height; y++) {
        out.write(colors.border + pixels.border);
        for (let x = 0; x < game_width; x++) {
            if (food.x === x && food.y === y) {
                out.write(colors.apple + pixels.apple + colors.border);
            } else if (snake[0].x === x && snake[0].y === y) {
                out.write(colors.snake + pixels.snake_head + colors.border);
            } else if (snake.some(part => part.x === x && part.y === y)) {
                out.write(colors.snake + pixels.snake_body + colors.border);
            } else {
                out.write(colors.empty_space + pixels.empty_space + colors.border);
            }
        }
        out.write(colors.border + pixels.border + "\n");
    }

    // Draw the top border
    out.write(colors.border + pixels.border.repeat(game_width + 2) + "\n");

    // Draw the score
    out.write(colors.score + "[SCORE] " + colors.reset + snake.length + "\n")
}
  

// Game loop
function gameLoop() {
    // Update snake position
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Draw gmae
    draw_game();

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        update_apple_pos(
            randint(1, game_width-2),
            randint(1, game_height-2)
        );
    } else {
        snake.pop(); // Remove the last part of the snake
    }

    // Game over conditions (snake hits the wall)
    if (
        head.x < 0 ||
        head.x >= game_width ||
        head.y < 0 ||
        head.y >= game_height ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        process.stdout.write('\x1Bc'); // Clear screen
        out.write(colors.game_over + "[GAME OVER!]\n" + colors.reset);
        out.write(colors.score + "[FINAL SCORE] " + colors.reset + snake.length + "!" + "\n");
        process.exit();
    }

    // Repeat
    setTimeout(gameLoop, speed);
}

// Start the game
gameLoop();
