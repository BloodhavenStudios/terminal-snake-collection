import time
import os
import random
import sys
from getkey import getkey
import threading

# Game settings
game_width = 20
game_height = int(game_width / 2)

class Pixels:
    snake_head = "S"
    snake_body = "s"
    apple = "@"
    border = "#"
    empty_space = " "

class Colors:
    snake = "\x1b[32m"
    apple = "\x1b[31m"
    border = "\x1b[34m"
    empty_space = ""
    game_over = "\x1b[31m"
    score = "\x1b[32m"
    reset = "\x1b[0m" 

snake = [{"x": 5, "y": 5}]
direction = {"x": 1, "y": 0}  # Moving right
food = {"x": 15, "y": 5}
speed = 0.2  # Speed of the game (in seconds)

# Clear the screen
os.system('cls' if os.name == 'nt' else 'clear')

# Listen for keypresses
def keypress():
    global direction

    while True:
        key = getkey()

        if key == "w":
            direction = {"x": 0, "y": -1}
        elif key == "s":
            direction = {"x": 0, "y": 1}
        elif key == "a":
            direction = {"x": -1, "y": 0}
        elif key == "d":
            direction = {"x": 1, "y": 0}

threading.Thread(target=keypress, daemon=True).start()

def update_apple_pos(x_pos, y_pos):
    food["x"] = x_pos
    food["y"] = y_pos

def drawGame():
    # Clear the screen
    os.system('cls' if os.name == 'nt' else 'clear')

    # Draw top border
    print(Colors.border + "#" * (game_width + 2))

    # Draw game area
    for y in range(game_height):
        sys.stdout.write(Colors.border + "#")
        for x in range(game_width):
            if x == food["x"] and y == food["y"]:
                sys.stdout.write(Colors.apple + "*" + Colors.border)
            elif snake[0]["x"] == x and snake[0]["y"] == y:
                sys.stdout.write(Colors.snake + Pixels.snake_head + Colors.border)
            elif any(part["x"] == x and part["y"] == y for part in snake):
                sys.stdout.write(Colors.snake + Pixels.snake_body + Colors.border)
            else:
                sys.stdout.write(Colors.empty_space + Pixels.empty_space + Colors.border)
        print("#")

    # Draw bottom border
    print("#" * (game_width + 2) + Colors.reset)
    print(Colors.snake + f"Score: {len(snake)}" + Colors.reset)

# Game loop
def gameLoop():
    global snake, direction, food

    # Update snake position
    head = {"x": snake[0]["x"] + direction["x"], "y": snake[0]["y"] + direction["y"]}
    snake.insert(0, head)

    # Check for food collision
    if head["x"] == food["x"] and head["y"] == food["y"]:
        update_apple_pos(random.randint(1, game_width - 2), random.randint(1, game_height - 2))
    else:
        snake.pop()  # Remove the last part of the snake if no food is eaten

    drawGame()

    # Game over conditions (snake hits the wall)
    if (
        head["x"] < 0 or
        head["x"] >= game_width or
        head["y"] < 0 or
        head["y"] >= game_height
    ):
        print("Game Over!")
        sys.exit()

    # Repeat
    time.sleep(speed)
    os.system('cls' if os.name == 'nt' else 'clear')
    gameLoop()

# Start the game
gameLoop()
