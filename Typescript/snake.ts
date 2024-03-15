// Imports
import * as readline from 'readline';
import {stdout as out} from 'process';

// Position interface
interface Position {
    x: number;
    y: number
}

// Game Settings
const game_width: number = 20;
const game_height: number = game_width/2; // Mimics game_width for a even sized map.

const pixels: { [key: string]: string } = {
    snake_head: "S",
    snake_body: "s",
    apple: "@",
    border: "#",
    empty_space: " "
};

const colors: { [key: string]: string } = {
    snake: "\x1b[32m",
    apple: "\x1b[31m",
    border: "\x1b[34m",
    empty_space: "",

    game_over: "\x1b[31m",
    score: "\x1b[32m",
    reset: "\x1b[0m" // Don't change.
};

let snake: Position[] = [{ x: 3, y: 3 }];
let direction: Position = { x: 1, y: 0 }; // Starts right
let food: Position = { x: 7, y: 3 };
let game_speed: number = 300; // Speed of the game

// Configure Terminal
readline.emitKeypressEvents(process.stdin);
if (process.stdin.setRawMode) process.stdin.setRawMode(true);

// Listen for keypresses
process.stdin.on("keypress", (str, key) => {
    if (key?.name === "q") {
        process.exit();
    } else {
        switch (key?.name) {
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
function randint(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create new apple position
function update_apple_position(x_pos: number, y_pos: number): void {
    food = {
        x: x_pos,
        y: y_pos
    };
}

// Function to draw the game
function draw_game(): void {
    // Clearing screen
    out.write("\x1Bc");

    // Draw the top border
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

function snake_game(): void {
    // Update snake position (move snake)
    const head: Position = { x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(head);

    // Draw game
    draw_game();

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        update_apple_position(
            randint(1, game_width-1),
            randint(1, game_height-1)
        );
    } else {
        snake.pop(); // Removes the last piece of the snake if no food was consumed
    }

    // Game over Conditions (hits wall || hits itself)
    if (
        head.x < 0 ||
        head.x >= game_width ||
        head.y < 0 ||
        head.y >= game_height ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
    ) {
        process.stdout.write('\x1Bc'); // Clear Screen
        out.write(colors.game_over + "[GAME OVER!]\n" + colors.reset);
        out.write(colors.score + "[FINAL SCORE] " + colors.reset + snake.length + "!" + "\n");
        process.exit();
    }

    // Repeat
    setTimeout(snake_game, game_speed);
}

// Start the game
snake_game();