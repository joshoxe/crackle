<template>
  <h1>Crackle</h1>

  <GameArea id="game-area" />
</template>

<script>
import GameArea from './components/GameArea/GameArea.vue'

export default {
  name: 'App',
  components: {
    GameArea
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

body, html {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100%;
  background-color: #121213;
  color: #29ac7e;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Roboto Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#game-area {
  flex-direction: column;
  flex-grow: 1;
}
</style>
