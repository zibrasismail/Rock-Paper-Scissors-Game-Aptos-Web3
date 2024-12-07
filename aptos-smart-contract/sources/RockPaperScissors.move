address 0xa32c9d9f274404e84c798fc70727c8d56890ef4bd56bb082ea9e299e098490e4 {

    module RockPaperScissors {
        use std::signer;
        use aptos_framework::randomness;
        use aptos_framework::timestamp;
        use aptos_framework::vector;
        use aptos_framework::coin;
        use aptos_framework::aptos_coin::AptosCoin;
        use aptos_framework::account;
        use aptos_framework::event;

        const ROCK: u8 = 1;
        const PAPER: u8 = 2;
        const SCISSORS: u8 = 3;

        const PLAYER_WINS: u8 = 2;
        const DRAW: u8 = 1;
        const COMPUTER_WINS: u8 = 3;

        const OWNER_ADDRESS: address = @0xa32c9d9f274404e84c798fc70727c8d56890ef4bd56bb082ea9e299e098490e4;

        const E_INSUFFICIENT_BALANCE: u64 = 1000;
        const E_ACTIVE_WAGER_EXISTS: u64 = 1001;
        const E_NO_ACTIVE_WAGER: u64 = 1002;
        const E_INVALID_MOVE: u64 = 1003;

        struct GameRound has store, drop {
            player_move: u8,   
            computer_move: u8,
            result: u8,
            timestamp: u64,
            wager: u64,
        }

        struct GameHistory has key {
            player: address,
            rounds: vector<GameRound>,
            total_wager: u64,
        }

        struct ModuleData has key {
            signer_cap: account::SignerCapability,
            wager_won_events: event::EventHandle<WagerWonEvent>,
        }

        struct WagerWonEvent has drop, store {
            amount: u64,
            timestamp: u64,
        }

        fun init_module(account: &signer) {
            let (resource_signer, signer_cap) = account::create_resource_account(account, b"RockPaperScissors");
            let resource_signer_addr = signer::address_of(&resource_signer);
            
            move_to(account, ModuleData { 
                signer_cap,
                wager_won_events: account::new_event_handle<WagerWonEvent>(&resource_signer),
            });
            
            if (!coin::is_account_registered<AptosCoin>(resource_signer_addr)) {
                coin::register<AptosCoin>(&resource_signer);
            };
        }

        public entry fun initialize_game(account: &signer) {
            let player = signer::address_of(account);
            
            if (!coin::is_account_registered<AptosCoin>(player)) {
                coin::register<AptosCoin>(account);
            };

            if (!exists<GameHistory>(player)) {
                move_to(account, GameHistory {
                    player,
                    rounds: vector::empty<GameRound>(),
                    total_wager: 0,
                });
            }
        }


        public entry fun start_game(account: &signer, wager_amount: u64) acquires GameHistory, ModuleData {
            let player = signer::address_of(account);
            
            if (!exists<GameHistory>(player) || !coin::is_account_registered<AptosCoin>(player)) {
                initialize_game(account);
            };

            assert!(coin::balance<AptosCoin>(player) >= wager_amount, E_INSUFFICIENT_BALANCE);

            let game_history = borrow_global_mut<GameHistory>(player);
            
            assert!(game_history.total_wager == 0, E_ACTIVE_WAGER_EXISTS);

            let module_data = borrow_global<ModuleData>(@0xa32c9d9f274404e84c798fc70727c8d56890ef4bd56bb082ea9e299e098490e4);
            let module_signer = account::create_signer_with_capability(&module_data.signer_cap);
            let module_address = signer::address_of(&module_signer);
            
            if (!coin::is_account_registered<AptosCoin>(module_address)) {
                coin::register<AptosCoin>(&module_signer);
            };
            
            coin::transfer<AptosCoin>(account, module_address, wager_amount);

            game_history.total_wager = wager_amount;
        }


        public entry fun play_game(account: &signer, player_move: u8) acquires GameHistory, ModuleData {
            let player = signer::address_of(account);
            let game_history = borrow_global_mut<GameHistory>(player);
            
            assert!(game_history.total_wager > 0, E_NO_ACTIVE_WAGER);
            assert!(player_move == ROCK || player_move == PAPER || player_move == SCISSORS, E_INVALID_MOVE);

            let timestamp = timestamp::now_microseconds();
            let computer_move = (((timestamp % 3) as u8) + 1);
            
            let result = determine_winner(player_move, computer_move);

            let module_data = borrow_global<ModuleData>(@0xa32c9d9f274404e84c798fc70727c8d56890ef4bd56bb082ea9e299e098490e4);
            let module_signer = account::create_signer_with_capability(&module_data.signer_cap);
            let module_address = signer::address_of(&module_signer);

            let wager = game_history.total_wager;
            let module_balance = coin::balance<AptosCoin>(module_address);

            if (result == PLAYER_WINS) {
                assert!(module_balance >= wager * 2, E_INSUFFICIENT_BALANCE);
                coin::transfer<AptosCoin>(&module_signer, player, wager * 2);
            } else if (result == DRAW) {
                assert!(module_balance >= wager, E_INSUFFICIENT_BALANCE);
                coin::transfer<AptosCoin>(&module_signer, player, wager);
            } else { // COMPUTER_WINS
                // No transfer needed
            };

            let new_round = GameRound {
                player_move,
                computer_move,
                result,
                timestamp,
                wager,
            };

            vector::push_back(&mut game_history.rounds, new_round);

            game_history.total_wager = 0;
        }

        fun determine_winner(player_move: u8, computer_move: u8): u8 {
            if (player_move == ROCK && computer_move == SCISSORS) {
                PLAYER_WINS
            } else if (player_move == PAPER && computer_move == ROCK) {
                PLAYER_WINS
            } else if (player_move == SCISSORS && computer_move == PAPER) {
                PLAYER_WINS
            } else if (player_move == computer_move) {
                DRAW
            } else {
                COMPUTER_WINS
            }
        }

        #[view]
        public fun get_latest_game(account_addr: address): (u8, u8, u8, u64, u64) acquires GameHistory {
            let game_history = borrow_global<GameHistory>(account_addr);
            let latest_round = vector::borrow(& game_history.rounds, vector::length(& game_history.rounds) - 1);
            (latest_round.player_move, latest_round.computer_move, latest_round.result, latest_round.timestamp, latest_round.wager)
        }

        #[view]
        public fun get_game_count(account_addr: address): u64 acquires GameHistory {
            let game_history = borrow_global<GameHistory>(account_addr);
            vector::length(& game_history.rounds)
        }

        #[view]
        public fun get_game_at_index(account_addr: address, index: u64): (u8, u8, u8, u64, u64) acquires GameHistory {
            let game_history = borrow_global<GameHistory>(account_addr);
            let round = vector::borrow(& game_history.rounds, index);
            (round.player_move, round.computer_move, round.result, round.timestamp, round.wager)
        }

        #[view]
        public fun get_current_wager(account_addr: address): u64 acquires GameHistory {
            let game_history = borrow_global<GameHistory>(account_addr);
            game_history.total_wager
        }

        public entry fun cancel_wager(account: &signer) acquires GameHistory, ModuleData {
            let player = signer::address_of(account);
            let game_history = borrow_global_mut<GameHistory>(player);
            
            assert!(game_history.total_wager > 0, E_NO_ACTIVE_WAGER);

            let module_data = borrow_global<ModuleData>(@0xa32c9d9f274404e84c798fc70727c8d56890ef4bd56bb082ea9e299e098490e4);
            let module_signer = account::create_signer_with_capability(&module_data.signer_cap);

            coin::transfer<AptosCoin>(&module_signer, player, game_history.total_wager);

            game_history.total_wager = 0;
        }

        public entry fun fund_module(account: &signer, amount: u64) acquires ModuleData {
            assert!(signer::address_of(account) == OWNER_ADDRESS, 0);
            let module_data = borrow_global<ModuleData>(OWNER_ADDRESS);
            let module_signer = account::create_signer_with_capability(&module_data.signer_cap);
            coin::transfer<AptosCoin>(account, signer::address_of(&module_signer), amount);
        }
    }
}
