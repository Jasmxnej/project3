<script setup lang="ts">
import { defineProps } from 'vue';
import { type Event } from '@/types';

defineProps<{ event: Event }>();
</script>

<template>
  <div>
    <h2>Country Details</h2>
    <p>Country Name: {{ event.name }}</p>
    <p>Continent: {{ event.continent }}</p>
    
  </div>
</template>
