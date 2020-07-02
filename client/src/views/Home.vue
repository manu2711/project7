<template>
  <div id="home" class="d-flex flex-column">
    <!-- Header -->
    <Header />
    <!-- Main -->
    <b-container id="main" fluid="lg">
      <b-row>
        <b-col class="d-flex flex-column align-items-center">
          <b-card
            v-for="article in articles"
            :key="article.id"
            :title="article.title"
            :img-src="article.image_url"
            img-top
            tag="article"
            class="article-card my-3"
          >
            <b-card-text :inner-html.prop="article.content | truncate(200)"></b-card-text>

            <b-button :to="articleLink(article.id)" variant="primary" aria-label="Read More">More</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<script>
// Import components
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

// Import depedencies
import axios from "axios";

export default {
  name: "Home",
  components: {
    Header,
    Footer
  },
  metaInfo: {
    title: 'Groupomania - Home page',
    htmlAttrs: {
        lang: 'en'
      }
  },
  data() {
    return {
      articles: [],
      articleTitle: "",
      articleContent: ""
    };
  },
  methods: {
    // Return /articles/articleURL
    articleLink: function(articleURL) {
      return `/articles/${articleURL}`;
    }
  },
  // Render all articles published
  async mounted() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/articles",
        this.$store.state.user.id
      );
      this.articles = response.data;
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="scss" scoped>
#home {
  height: 100%;
  margin-top: 5rem;

  .article-card{
    width: 100%; 
    max-width: 50rem
  }

  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
