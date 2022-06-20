<template>
    <div>
        <div id="board">
            <div v-for="row in gameBoard" :key="row">
                <span id="game-cell" v-for="char in row" :key="char" v-on:mouseover="writeOutGuess(char)" @click="handleGuess(char)">{{ char }}</span>
            </div>
        </div>

        <div id="guess-area">
            <div id="guess-input">
                {{ guess }}
            </div>

            <div id="guess-log">
                <div v-for="guess in guessLog" :key="guess.guess">
                <span id="guess-text"> {{ guess.guess }}</span><br /><span id="guess-likeness" v-for="i in guess.likeness" :key="i" class="box green animate__animated animate__flipInY"></span><span id="guess-partial-likeness" v-for="i in guess.partial_likeness" :key="i" class="box orange animate__animated animate__flipInY"></span></div>
            </div>
        </div>


        <transition>
            <div id="overlay" @click="this.gameOverModalActive = false" v-if="this.gameOverModalActive">
            </div>
        </transition>

        <transition>
            <GameOverModalVue id="game-over-modal" :active="this.gameOverModalActive" @close-game-over-modal="this.gameOverModalActive = false" />
        </transition>


    </div>
</template>

<script>
    import { RandomString } from '../../services/random-string';
    import { WordPicker } from '../../services/word-picker';
    import { Game } from '../../services/game';
    import GameOverModalVue from '../GameOverModal.vue';
    import { StorageService } from '../../services/storage';

    const randomString = new RandomString();
    const wordPicker = new WordPicker();
    const storageService = new StorageService;
    const game = new Game(wordPicker, randomString);

    export default {
    data() {
        return {
            answer: "",
            gameBoard: [[]],
            guess: "",
            guessLog: [],
            gameState: '',
            gameOverModalActive: false
        };
    },
    methods: {
        loadGame() {
            this.gameBoard = game.loadGame();
        },
        restoreState() {
            const state = storageService.getCurrentState();
            if(!state) {
                return;
            }

            const currentDay = new Date();

            const lastPlayed = new Date(state.lastPlayedTime);

            if(lastPlayed.getDate() !== currentDay.getDate()) {
                storageService.resetCurrentState();
                return;
            }

            if(state.gameState !== 'IN_PROGRESS') {
                game.remainingGuesses = 0;
                this.guessLog = state.guessLog;
                this.triggerGameOver();
                return;
            }

            this.guessLog = state.guessLog;
            this.gameState = state.gameState;
            game.remainingGuesses -= this.guessLog.length;
        },
        writeOutGuess(char) {
            this.guess = char;
        },
        handleGuess(guess) {
            if (guess.length === 1 || game.remainingGuesses <= 0) {
                return;
            }

            try {
                const guessResult = game.checkGuess(guess);
                if (guessResult) {
                    this.guessLog.push(guessResult);
                    storageService.saveCurrentState(this.guessLog, 'IN_PROGRESS')
                }
                else {
                    this.handleGameOver(false);
                    storageService.saveCurrentState(this.guessLog, 'LOSE')

                }
                if (guessResult.likeness === 5) {
                    this.handleGameOver(true);
                    game.remainingGuesses = 0;
                    storageService.saveCurrentState(this.guessLog, 'WIN')

                }
            } catch(e) {
                console.error(`Attempted to handle a guess and failed: ${e}`);
            }
        },
        triggerGameOver() {
            setTimeout(() => { this.gameOverModalActive = true }, 1500)
        },
        handleGameOver(win) {
            const totalGuesses = Math.abs(game.remainingGuesses - 4);
            console.log(totalGuesses);
            storageService.recordGamePlayed(totalGuesses, win)
            this.triggerGameOver();
        }
    },
    mounted() {
        this.loadGame();
        this.restoreState();
    },
    components: { GameOverModalVue }
}
</script>

<style scoped>
    @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

    #game-area {
        width: 90%;
        max-width: 500px;
    }

    #game-over-modal {
        z-index: 999;
        position: fixed;
        left: 50%;
        top: 50%;
        -ms-transform: translate(-50%,-50%);
        -moz-transform:translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
    }


    #overlay {
        opacity:    0.5;
        background: #000;
        width:      100%;
        height:     100%;
        top:        0;
        left:       0;
        position:   fixed;
    }

    .box {
        display: inline-block;
        height: 20px;
        width: 20px;
        border: 1px solid rgba(0, 0, 0, .2);
        border-radius: 50%;
        margin-left: 1%;
    }

    .green {
        background-color: #019a01;
    }

    .orange {
        background-color: #ffc425;
    }

    #board {
        height: 50%;
        display: grid;
        grid-template-rows: repeat(8, 1fr);
        margin-top: 10%;
        font-size: 36px;
        font-weight: 500;
        text-transform: uppercase;
        text-align: center;
    }

    #game-cell:hover {
        color: black;
        background-color: #29ac7e;
        cursor: pointer;
    }

    #guess-input {
        text-align: left;
        font-size: 36px;
        text-transform: uppercase;
        overflow: hidden;
    }

    #guess-area {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 3%;
    }

    #guess-input {
        width: 55%;
    }

    #guess-log {
        width: 45%;
    }

    #guess-input::before {
        content: "> "
    }

    #guess-text::before {
        content: "> "
    }

    #guess-text {
        font-size: 28px;
        text-transform: uppercase;
    }

    #guess-likeness, #guess-partial-likeness {
        font-size: 28px;
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.2s ease, height 0.2s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        height: 50%;
    }

    @keyframes typing {
        from { width: 0 }
        to { width: 100% }
    }

@media screen and (max-width: 600px) {
        #board {
            font-size: 28px;
            width: 100%;
            height: 80%;
        }
    }
</style>