import axios from 'axios';

const apiClient = axios.create({
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
});

async function fetchDataPart(part: string) {
  return apiClient.get(`https://my-json-server.typicode.com/Jasmxnej/${part}`).then(response => {
    return response.data || [];
  });
}

export default {
  async getAllEvents() {
    const parts = [
      'countrymedal/data1',
      'data2/data2',
      'data3/data3',
      'data4/data4',
      'data5/data5',
    ];

    const dataPromises = parts.map(part => fetchDataPart(part));
    const results = await Promise.all(dataPromises);

    const allEvents = results.flat();
    return allEvents;
  },

  async getEvent(id: string) {
    const events = await this.getAllEvents();
    const event = events.find(event => event.id === id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }
    return event;
  },
};
