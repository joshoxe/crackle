<template>
    <div v-if="this.active">
    <button id="exit-button" @click="$emit('close-game-over-modal')"><font-awesome-icon id="close-icon" icon="fa-solid fa-xmark" /></button>
    <header><h1>Statistics</h1></header>
    <section id="stats">
        <div id="played-stats">
            <h2 id="statistic-content">{{ this.gamesPlayed }}</h2>
            <h3 id="statistic-header">Played</h3>
        </div>

        <div id="win-stats">
            <h2 id="statistic-content">{{ this.winPercentage }}</h2>
            <h3 id="statistic-header">Win %</h3>
        </div>

        <div id="current-streak-stats">
            <h2 id="statistic-content">{{ this.currentStreak }}</h2>
            <h3 id="statistic-header">Current<br />Streak</h3>
        </div>

        <div id="max-streak-stats">
            <h2 id="statistic-content">{{ this.maxStreak }}</h2>
            <h3 id="statistic-header">Max<br />Streak</h3>
        </div>
    </section>

    <section id="distribution">
        <section id="distribution-graph"></section>
    </section>

    <section id="bottom-section">
        <section id="next-game-timer">
            <h3>Next Crackle</h3>
            <h2 id="timer-content">
                {{this.hours}}:{{this.minutes}}:{{this.seconds}}
            </h2>
        </section>
        <section id="share">
            <button id="share-button" @click="shareResult()">Share <font-awesome-icon id="share-icon" icon="fa-solid fa-share-nodes"/></button>
        </section>
    </section>
    </div>
</template>

<script>
import { ShareService } from '../services/share';
import { StorageService } from '../services/storage';

const storageService = new StorageService();
const shareService = new ShareService();

export default {
    props: {
        active: Boolean,
    },
    data() {
        return {
            hours: '',
            minutes: '',
            seconds: '',
            stats: this.getGameStats(),
        }

    },
    methods: {
        getNextCrackleDate() {
            setInterval(() => {
                const now = new Date();
                const countTo = new Date().setHours(24, 0, 0);

                const distance = countTo - now;

                this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
                this.hours = this.hours.toLocaleString('en-UK', {minimumIntegerDigits: 2, useGrouping:false})
                this.minutes = this.minutes.toLocaleString('en-UK', {minimumIntegerDigits: 2, useGrouping:false})
                this.seconds = this.seconds.toLocaleString('en-UK', {minimumIntegerDigits: 2, useGrouping:false})
            }, 1000)
        },
        getGameStats() {
            const gameStats = storageService.getLocalStatistics();

            this.gamesPlayed = gameStats.gamesPlayed;
            this.winPercentage = gameStats.winPercentage;
            this.currentStreak = gameStats.currentStreak;
            this.maxStreak = gameStats.maxStreak;
        },
        shareResult() {
            shareService.copyResult();
        }
    },
    created() {
        this.getNextCrackleDate();
        this.getGameStats();
    },
    // renderTriggered () {
    //     this.getGameStats();
    // }
}
</script>

<style scoped>
    button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
    }

    #game-over-modal {
        width: inherit;
        max-width: 500px;
        background-color: #121213;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 10px;
        border: 1px solid rgba(85, 85, 85, .3);
        border-radius: 8px;
    }

    #exit-button {
        align-self: flex-end;
    }

    header {
        display: flex;
        justify-content: center;
    }

    #stats {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        text-align: center;
        font-size: 0.8em;
        word-wrap: break-word;
        margin: 0 10%;
    }

    #bottom-section {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        align-items: flex-end;
        justify-content: space-between;
    }

    #share, #next-game-timer {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        height: 50%;
        width: 50%;
    }

    #share-button {
        font-size: 1.3em;
    }

    #share-icon {
        position: relative;
        top: 2px;
    }

    #next-game-timer {
        display: flex;
        flex-direction: column;
    }

    #timer-content {
        font-size: 2em;
    }

</style>