<template>
  <div class="home">
    <Header v-if="isLoggedIn" />
    <b-container id="main" fluid="lg">
      <b-row
        v-if="!isLoggedIn"
        align-v="center"
        align-h="center"
        class="justify-content-lg-between"
      >
        <b-col cols="12" lg="6" class="mb-5 mb-lg-0" style="max-width: 30rem">
          <img src="../assets/images/icon-left-font.png" alt="Groupomania icon" />
        </b-col>
        <b-col class="text-left" cols="12" lg="6" style="max-width: 30rem">
          <h3 class="text-center">Login</h3>

          <!-- Login Form -->
          <LoginForm />

          <div class="mt-2 text-center">
            <a href="#" v-b-modal.register-modal>Register</a>
          </div>
          <b-modal id="register-modal" action="#" title="User registration" centered hide-footer>
            <RegisterForm />
          </b-modal>
        </b-col>
      </b-row>

      <!-- If we are loggedIn, we render all articles -->
      <b-row v-if="isLoggedIn">
        <b-col class="d-flex flex-column align-items-center">
          <b-card
            v-for="article in articles"
            :key="article.id"
            :title="article.title"
            tag="article"
            style="width: 100%; max-width: 60rem"
            class="mb-2"
          >
            <b-card-text :inner-html.prop="article.content | truncate(200)"></b-card-text>

            <b-button :to="articleURL(article.url)" variant="primary">More</b-button>
            <b-button
              v-if="isOwner(article.user_id)"
              class="ml-2"
              href="#"
              variant="danger"
              @click="deleteArticle(article.id)"
            >Delete</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// Import components
import Header from "@/components/Header.vue";
import RegisterForm from "@/components/RegisterForm.vue";
import LoginForm from "@/components/LoginForm";

// Import depedencies
import axios from 'axios'



export default {
  name: "Home",
  components: {
    Header,
    RegisterForm,
    LoginForm
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  data() {
    return {
      articles: [],
      articleTitle: "",
      articleContent: ""
    }
  },
  methods: {
    isOwner: function(articleOwner) {
      if (articleOwner == this.$store.state.user.id) return true;
    },
    articleURL: function(articleURL) {
      return `/articles/${articleURL}`
    },
    deleteArticle: async function (articleId) {
      try {
        axios.delete(`http://localhost:3000/api/articles/${articleId}`)
        .then((response) => {
          console.log(response.data)
          this.$router.go()
          })
        
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get("http://localhost:3000/api/articles");
      this.articles = response.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 90vh;
  margin-top: 4rem;

  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    img {
      width: 100%;
    }
  }
}
</style>
