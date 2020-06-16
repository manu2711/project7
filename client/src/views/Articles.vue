<template>
  <div class="home">
    <Header v-if="isLoggedIn" />
    <b-container id="main" fluid="lg">
      <b-row>
        <b-col class="d-flex justify-content-center">
          
            <b-card
              img-src="https://picsum.photos/600/300/?image=25"
              img-alt="Image"
              img-top
              tag="article"
              style="width: 100%; max-width: 60rem;"
              class="mb-5 mt-5"
            > 
              <h1>{{article.title}}</h1>
              <p class="card-subtitle text-muted mb-3">By Emmanuel on 30-03-2020</p>
              <b-card-text v-html="article.article_content" class="text-justify"></b-card-text>

              <b-button href="#" variant="primary">Edit</b-button>
              <b-button href="#" variant="danger" class="ml-3">Delete</b-button>
            </b-card>
          
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import axios from "axios";

// Depedencies

export default {
  name: "Home",
  components: {
    Header
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  data() {
    return {
      article: ""
    };
  },
  methods: {
    // Login Function
    login: function() {
      const data = {
        email: this.loginEmail,
        password: this.loginPassword
      };
      this.$store
        .dispatch("login", data)
        .then(() => this.$router.push("/dashboard"))
        .catch(error => {
          console.log(error);
          this.$router.push("/");
        });
    }
  },
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/articles/${this.$route.params.id}`
      );
      this.article = response.data[0];
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 90vh;

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
