<script setup lang="ts">
import { defineProps } from 'vue';
import { type Event } from '@/types';

defineProps<{
  event: Event;
}>();
</script>

<template>
  <div v-if="event && event.id" class="event-card-wrapper">
    <div class="event-card">
      <img :src="event.flag_url" alt="Flag" class="flag" />
      <h2>{{ event.name }}</h2>
      <p>Gold: {{ event.gold_medals }}</p>
      <p>Silver: {{ event.silver_medals }}</p>
      <p>Bronze: {{ event.bronze_medals }}</p>
      <p>Total Medals: {{ event.total_medals }}</p>
    </div>
  </div>
</template>

<style scoped>
.event-card-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.event-card {
  padding: 20px;
  width: 250px;
  cursor: pointer;
  border: 1px solid #39495c;
  margin-bottom: 18px;
  text-align: center;
}

.event-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}

.flag {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
</style>
