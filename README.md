# Aptos Rock Paper Scissors Game

This project is an Aptos-based implementation of the classic Rock Paper Scissors game, featuring a Move smart contract backend and a Next.js frontend. Players can wager APT tokens, play against a computer opponent, and enjoy an interactive gaming experience on the Aptos blockchain.

## Features

- **Blockchain-based Gameplay**: Utilizes Aptos blockchain for secure and transparent game logic.
- **APT Token Wagering**: Players can bet APT tokens on game outcomes.
- **Interactive Frontend**: User-friendly Next.js interface for seamless gameplay.
- **Smart Contract Integration**: Move smart contract handles game logic and token transactions.
- **Wallet Connection**: Integrates with Aptos wallet for secure transactions.
- **Score Tracking**: Keeps track of player and computer scores across multiple rounds.
- **Confetti Celebration**: Visual celebration effect when the player wins.

## Smart Contract Functions

The Move smart contract includes several key functions that handle the game logic:

1. `initialize_game`: Sets up the initial game state for a player.

   ```move
   public entry fun initialize_game(account: &signer)
   ```

2. `start_game`: Begins a new game round with a specified wager amount.

   ```move
   public entry fun start_game(account: &signer, amount: u64)
   ```

3. `play_game`: Executes a player's move and determines the game outcome.

   ```move
   public entry fun play_game(account: &signer, player_move: u64)
   ```

4. `cancel_wager`: Allows a player to cancel their wager and end the current game.
   ```move
   public entry fun cancel_wager(account: &signer)
   ```

These functions handle the core game mechanics, including initializing the game state, managing wagers, processing player moves, and determining game outcomes.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Aptos
- **Smart Contract**: Move language
- **Wallet Integration**: Aptos Wallet Adapter

## Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/aptos-rock-paper-scissors.git
   cd aptos-rock-paper-scissors
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:

   ```
   NEXT_PUBLIC_MODULE_ADDRESS = "0xa32c9d9f274404e84c798fc70727c8d56890ef4bd56bb082ea9e299e098490e4"
   NEXT_PUBLIC_MODULE_NAME = "RockPaperScissors"
   ```

4. Run the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Deployment

1. Ensure you have the Aptos CLI installed.
2. Navigate to the `aptos-smart-contract` directory.
3. Compile and deploy the contract:
   ```
   aptos init
   aptos move compile
   aptos move publish
   ```

## How to Play

1. Connect your Aptos wallet.
2. Initialize the game.
3. Enter the amount of APT you want to wager.
4. Choose Rock, Paper, or Scissors.
5. Wait for the computer's choice and see the result.
6. Play multiple rounds and track your score.

## Project Structure

- `/components`: React components including game interface elements.
- `/app`: Next.js pages for routing.
- `/lib`: Utility functions and constants.
- `/aptos-smart-contract`: Move smart contract files.

## Video Demo

https://www.youtube.com/watch?v=1gLYh1sI7lQ

## Future Enhancements

- Implement player vs player mode.
- Add leaderboard functionality.
- Introduce more complex game variations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Aptos team for the blockchain platform.
- StackUp for the bounty program inspiration.
