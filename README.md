Here's a structured README file for your GitHub repository for the **Math Sprint** app:

---

# Math Sprint

**Math Sprint** is a mobile-friendly math practice app that allows users to improve their arithmetic skills through quick and engaging sessions. Users can select a math operation (addition, subtraction, multiplication, or division) and answer as many questions as possible within a set time limit. Each correct answer earns points, while incorrect answers deduct points—but scores won’t fall below zero. Each operation has its own separate score table for fair competition and tracking.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Operation Selection**: Choose between addition, subtraction, multiplication, or division.
- **Timed Sessions**: Answer as many questions as possible within the given time.
- **Scoring System**: 
  - +10 points for each correct answer, -5 points for each incorrect answer (minimum score of 0).
  - Separate score tables for each operation, so users can see their best scores for each type.
- **Custom Numeric Keypad**: Mobile-friendly numeric keypad for quick input on touch devices.
- **Responsive Design**: Adapts well to both mobile and desktop devices.
- **User Authentication**: Sign in or register using Supabase for personalized score tracking.

## Technologies Used

- **Frontend**: Vite.js + React
  - **Styling**: Chakra UI for responsive, accessible design.
  - **Responsive Numeric Keypad**: Custom numeric keypad for mobile compatibility.
- **Backend**: Supabase
  - **Authentication**: User sign-up and login.
  - **Database**: Supabase PostgreSQL for storing user scores by operation type.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/Math-Sprint.git
    cd Math-Sprint
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up Supabase**:
   - Create a Supabase project at [Supabase](https://supabase.io/).
   - Set up authentication and create a table called `scores` with the following schema:

      | Column      | Type      | Description                               |
      |-------------|-----------|-------------------------------------------|
      | `id`        | UUID      | Primary key                               |
      | `user_id`   | UUID      | References `auth.users.id` for each user  |
      | `score`     | Integer   | User’s score for a session                |
      | `operation` | Text      | Operation type (addition, subtraction, multiplication, division) |
      | `created_at`| Timestamp | Auto-generated timestamp                  |

   - Configure your `.env` file with your Supabase credentials:
      ```plaintext
      VITE_SUPABASE_URL=<your-supabase-url>
      VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
      ```

4. **Run the app**:
    ```bash
    npm run dev
    ```

5. **Visit**: Open your browser and go to `http://localhost:3000`.

## Usage

1. **Login/Register**: Create an account or log in to access the game.
2. **Choose Operation**: Select an operation (Addition, Subtraction, Multiplication, or Division) from the main menu.
3. **Play the Game**:
   - You’ll have a set time to answer as many questions as possible.
   - Use the on-screen numeric keypad to enter answers and submit.
   - For each correct answer, you gain 10 points; each wrong answer deducts 5 points (but the score cannot go below 0).
4. **View Scores**: After each session, view your score and check the leaderboard for each operation.

## Game Rules

- **Scoring**: 
  - Correct answer: +10 points
  - Incorrect answer: -5 points
  - Minimum score: 0
- **Separate Leaderboards**: Scores are tracked individually for addition, subtraction, multiplication, and division.
- **Timer**: Each session lasts 30 seconds per selected operation.

## Future Enhancements

- **Leaderboard**: Display top scores by operation across all users.
- **Difficulty Levels**: Add easy, medium, and hard levels, scaling the numbers used in problems.
- **User Progress Tracking**: Visualize user progress over time with score history.
- **Sound Effects**: Add optional sounds for correct, incorrect answers, and keypad clicks.
