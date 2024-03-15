using System;
using System.Collections.Generic;
using System.Threading;

class Snake {
    
    private const int game_width = 20;
    private const int game_height = game_width/2;
    private const int game_speed = 150; // Speed in milliseconds
    private static readonly Random rand = new Random();
    private static readonly List<(int, int)> snake = new List<(int, int)> { (10, 5) };
    private static (int, int) food = (rand.Next(1, game_width - 2), rand.Next(1, game_height - 2));
    private static (int, int) direction = (1, 0); // Moving right initially
    private static bool gameOver = false;

    // Pixel characters dictionary
    private static Dictionary<string, char> pixels = new Dictionary<string, char>() {
        { "snake_head", 'S' },
        { "snake_body", 's' },
        { "apple", '@' },
        { "border", '#' },
        { "empty_space", ' ' }
    };

    // Colors dictionary
    private static Dictionary<string, ConsoleColor> colors = new Dictionary<string, ConsoleColor>() {
        { "snake", ConsoleColor.Green },
        { "apple", ConsoleColor.Red },
        { "border", ConsoleColor.Blue },
        { "empty_space", ConsoleColor.Gray },

        { "game_over", ConsoleColor.Red },
        { "score", ConsoleColor.Green }
    };

    public static void Main (string[] args) {
        Console.WriteLine ("Hello World");

        Console.CursorVisible = false;
        while (!gameOver)
        {
            if (Console.KeyAvailable)
            {
                ConsoleKeyInfo key = Console.ReadKey(true);
                switch (key.Key)
                {
                    case ConsoleKey.W:
                        direction = (0, -1);
                        break;
                    case ConsoleKey.S:
                        direction = (0, 1);
                        break;
                    case ConsoleKey.A:
                        direction = (-1, 0);
                        break;
                    case ConsoleKey.D:
                        direction = (1, 0);
                        break;
                    case ConsoleKey.Q:
                        return;
                }
            }

            MoveSnake();

            DrawGame();

            Thread.Sleep(game_speed);
        }

        Console.Clear();

        Console.ForegroundColor = colors["game_over"];
        Console.WriteLine("[Game Over!]");
        Console.ResetColor(); 

        Console.ForegroundColor = colors["score"];
        Console.Write("Final Score: ");
        Console.ResetColor();
        Console.Write($"{snake.Count}!");
        Console.ResetColor();
        Console.WriteLine();

        Console.ReadKey();
    }

    private static void MoveSnake()
    {
        var head = (snake[0].Item1 + direction.Item1, snake[0].Item2 + direction.Item2);

        if (head.Item1 < 0 || head.Item1 >= game_width || head.Item2 < 0 || head.Item2 >= game_height || snake.Contains(head))
        {
            gameOver = true;
            return;
        }

        if (head == food)
        {
            snake.Insert(0, head);
            food = (rand.Next(1, game_width - 2), rand.Next(1, game_height - 2));
        }
        else
        {
            snake.Insert(0, head);
            snake.RemoveAt(snake.Count - 1);
        }
    }

    private static void DrawGame()
    {
        Console.Clear();
        for (int y = 0; y < game_height; y++)
        {
            for (int x = 0; x < game_width; x++)
            {
                if (food == (x, y))
                {
                    Console.ForegroundColor = colors["apple"];
                    Console.Write(pixels["apple"]);
                }
                else if (x == 0 || x == game_width - 1 || y == 0 || y == game_height - 1)
                {
                    Console.ForegroundColor = colors["border"];
                    Console.Write(pixels["border"]);
                }
                else if (snake.Contains((x, y)))
                {
                    Console.ForegroundColor = colors["snake"];
                    Console.Write(snake[0] == (x, y) ? pixels["snake_head"] : pixels["snake_body"]);
                }
                else
                {
                    Console.ForegroundColor = colors["empty_space"];
                    Console.Write(pixels["empty_space"]);
                }
            }
            Console.WriteLine();
            
        }
        
        Console.ForegroundColor = colors["score"];
        Console.Write("[Score] ");
        Console.ResetColor();
        Console.Write(snake.Count);
        Console.ResetColor();
        Console.WriteLine();
    }
}
