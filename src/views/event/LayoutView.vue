<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/stores/event';

const route = useRoute();
const countryId = route.params.id as string;
const eventStore = useEventStore();

const event = computed(() => eventStore.currentEvent || eventStore.getEventById(countryId));

onMounted(async () => {
  if (!event.value) {
    try {
      const fetchedEvent = await eventStore.getEventById(countryId);
      if (fetchedEvent) {
        eventStore.setEvent(fetchedEvent);
      } else {
        console.error(`Country with ID ${countryId} not found.`);
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }
});
</script>

<template>
  <div>
    <div v-if="event">
      <h1>{{ event.name }}</h1>
      <nav>
        <RouterLink :to="{ name: 'country-detail-view', params: { id: event.id } }">Country Detail</RouterLink> |
        <RouterLink :to="{ name: 'medal-detail-view', params: { id: event.id } }">Medal Detail</RouterLink>
      </nav>
      <RouterView v-if="event" :key="event.id" :event="event" />
    </div>
    <div v-else>
      <p>Country not found or failed to load.</p>
    </div>
    <div class="comment-box">
    <h3>Leave a Comment</h3>
    <input v-model="commenterName" placeholder="Your name" />
    <textarea v-model="commentText" placeholder="Your comment"></textarea>
    <button @click="submitComment">Submit Comment</button>

    <ul class="comments-list">
      <li v-for="(comment, index) in comments" :key="index">
        <strong>{{ comment.name }}</strong> ({{ comment.date }}): {{ comment.text }}
      </li>
    </ul>
  </div>
  </div>
</template>

<style scoped>
nav {
  margin-bottom: 20px;
}

nav a {
  text-decoration: none;
  color: #2c3e50;
  margin: 0 10px;
}

nav a:hover {
  text-decoration: underline;
}
.comment-box {
  margin: 20px auto;
  padding: 20px;
  max-width: 600px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.comment-box input,
.comment-box textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.comment-box button {
  padding: 10px 20px;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.comment-box button:hover {
  background-color: #368f6e;
}

.comments-list {
  list-style: none;
  padding: 0;
}

.comments-list li {
  margin-bottom: 10px;
}
</style>
