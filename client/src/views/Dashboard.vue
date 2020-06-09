<template>
  <div id="dashboard">
    <Header />
    <b-container>
      <h1>Dashboard</h1>
      <b-row>
        <b-col class="d-flex flex-column align-items-center">
          <b-card
            v-for="article in articles"
            :key="article.id"
            :title="article.title"
            tag="article"
            style="width: 100%; max-width: 40rem"
            class="mb-2"
          >
            <b-card-text>{{ article.article }}</b-card-text>

            <b-button href="#" variant="primary">More</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
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
      const response = await axios.get("http://localhost:3000/api/articles");
      this.articles = response.data;
    } catch (error) {
      console.log(error);
    }
  }
};
</script>