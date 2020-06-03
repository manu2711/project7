<template>
  <div id="dashboard">
    <Header />
    <h1>Dashboard</h1>
    <!-- <div class="article" v-for="article in articles" :key="article.id">
      <h2 class="title">{{ article.title }}</h2>
      <div class="description">{{ article.article }}</div>
      <div class="date">{{ article.date }}</div>
    </div> -->

    <b-card
    v-for="article in articles" :key="article.id"
    :title="article.title"
    tag="article"
    style="max-width: 40rem;"
    class="mb-2"
  >
    <b-card-text>
      {{ article.article }}
    </b-card-text>

    <b-button href="#" variant="primary">More</b-button>
  </b-card>
  </div>
</template>

<script>
// Components
// @ is an alias to /src
import Header from "@/components/Header.vue";

// Depedencies
import axios from "axios";

export default {
  name: "Dashboard",
  components: {
    Header
  },
  data() {
    return {
      articles: []
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/api/articles')
      this.articles = response.data
    } catch (error) {
      console.log(error)
    }
  }
};
</script>