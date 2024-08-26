<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useMessageStore } from '@/stores/message' // Correctly import the message store
import EventService from '@/services/EventService'
import { useRoute, useRouter } from 'vue-router'
import { type Event } from '@/types'

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore() // Correctly instantiate the message store

const allEvents = ref<Event[]>([])
const events = ref<Event[]>([])
const totalEvents = ref(0)
const pageSize = ref(Number(route.query.pageSize) || 5)
const page = ref(Number(route.query.page) || 1)

const commenterName = ref('')
const commentText = ref('')
const comments = ref<{ name: string; text: string; date: string }[]>([])

const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize.value))
const hasNextPage = computed(() => page.value < totalPages.value)
const hasPrevPage = computed(() => page.value > 1)

function paginateData() {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  events.value = allEvents.value.slice(start, end)
}

async function fetchAllEvents() {
  try {
    const response = await EventService.getAllEvents()
    allEvents.value = response
    totalEvents.value = allEvents.value.length
    paginateData()
  } catch (error) {
    console.error('There was an error fetching events!', error)
    allEvents.value = []
    totalEvents.value = 0
  }
}

function submitComment() {
  if (commentText.value.trim() === '' || commenterName.value.trim() === '') {
    alert('Please enter both your name and a comment.')
    return
  }

  const newComment = {
    name: commenterName.value,
    text: commentText.value,
    date: new Date().toLocaleString()
  }

  comments.value.push(newComment)

  // Trigger the flash message
  messageStore.updateMessage('Comment successfully posted!')

  // Clear the comment fields
  commenterName.value = ''
  commentText.value = ''
}

onMounted(() => {
  if (!route.query.pageSize || !route.query.page) {
    router.replace({
      name: 'event-list-view',
      query: { pageSize: pageSize.value, page: page.value }
    })
  }
  fetchAllEvents()
})

watch([pageSize, page], () => {
  paginateData()
})

function updatePageSize(size: number) {
  pageSize.value = size
  page.value = 1
  router.push({
    name: 'event-list-view',
    query: {
      pageSize: pageSize.value,
      page: page.value
    }
  })
}

function changePage(newPage: number) {
  page.value = newPage
  router.push({
    name: 'event-list-view',
    query: {
      pageSize: pageSize.value,
      page: page.value
    }
  })
}
</script>

<template>
  <h1>Olympic Medal Table</h1>

  <table class="medal-table">
    <thead>
      <tr>
        <th>Flag</th>
        <th>
          <div>
            <label for="page-size">Country </label>
            <select id="page-size" v-model="pageSize" @change="updatePageSize(pageSize)">
              <option v-for="n in [5, 10, 15, 20, 25, 30]" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </th>
        <th>Gold</th>
        <th>Silver</th>
        <th>Bronze</th>
        <th>Total Medals</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="event in events" :key="event.id">
        <td><img :src="event.flag_url" alt="Flag" class="flag" /></td>
        <td>
          <RouterLink :to="{ name: 'layout-view', params: { id: event.id } }">
            {{ event.name }}
          </RouterLink>
        </td>
        <td>{{ event.gold_medals || event.medals_by_sport?.until_2024?.total?.gold || 0 }}</td>
        <td>{{ event.silver_medals || event.medals_by_sport?.until_2024?.total?.silver || 0 }}</td>
        <td>{{ event.bronze_medals || event.medals_by_sport?.until_2024?.total?.bronze || 0 }}</td>
        <td>{{ event.total_medals }}</td>
      </tr>
    </tbody>
  </table>

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

  <div class="pagination" v-if="totalPages > 1">
    <RouterLink
      v-if="hasPrevPage"
      :to="{ name: 'event-list-view', query: { page: page - 1, pageSize: pageSize } }"
      @click.prevent="changePage(page - 1)"
      rel="prev"
      class="page-prev"
    >
      &#60;
    </RouterLink>
    <span class="current-page">Page {{ page }} of {{ totalPages }}</span>
    <RouterLink
      v-if="hasNextPage"
      :to="{ name: 'event-list-view', query: { page: page + 1, pageSize: pageSize } }"
      @click.prevent="changePage(page + 1)"
      rel="next"
      class="page-next"
    >
      &#62;
    </RouterLink>
  </div>

  <div v-if="totalEvents === 0">
    <p>No countries available.</p>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 20px;
  text-align: center;
}

.page-size-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.page-size-selector label {
  margin-right: 10px;
}

.medal-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto 20px;
  text-align: left;
}

.medal-table th,
.medal-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.medal-table th {
  background-color: #f2f2f2;
}

.flag {
  width: 50px;
  height: auto;
}

.pagination {
  display: flex;
  justify-content: space-between;
  width: 350px;
  margin: 20px auto 0;
  align-items: center;
}

.pagination .current-page {
  font-weight: bold;
  text-align: center;
  flex: 1;
}

.pagination a {
  text-decoration: none;
  color: #2c3e50;
}

.page-prev {
  text-align: left;
}

.page-next {
  text-align: right;
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
