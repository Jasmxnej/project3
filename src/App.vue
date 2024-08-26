<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMessageStore } from './stores/message'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const store = useMessageStore()
const { message } = storeToRefs(store)

const flashMessageVisible = ref(false)

watch(message, (newValue) => {
  if (newValue) {
    flashMessageVisible.value = true
    setTimeout(() => {
      flashMessageVisible.value = false
      store.resetMessage()
    }, 3000) // Flash message will disappear after 3 seconds
  }
})
</script>

<template>
  <div id="layout">
    <header>
      <div id="flashMessage" v-if="flashMessageVisible" class="flash-message">
        <h4>{{ message }}</h4>
      </div>
      <div class="wrapper">
        <nav>
          <RouterLink :to="{ name: 'event-list-view' }">Home</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
#layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

h2 {
  font-size: 20px;
}

@keyframes yellofade {
  from {
    background-color: yellow;
  }
  to {
    background-color: transparent;
  }
}

#flashMessage {
  animation: yellofade 3s ease-in-out;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: yellow;
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
}

.flash-message {
  background-color: #f0ad4e;
  color: black;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
