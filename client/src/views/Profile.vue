<template>
  <div class="profile">
    <Header v-if="isLoggedIn" />
    <b-container id="main" fluid="lg">
      <b-row>
        <b-col class="d-flex justify-content-center">
          <div class="mt-4">
            <h4>Left and Right (or Start and End)</h4>
            <b-card
              img-src="https://placekitten.com/200/200"
              img-alt="Card image"
              img-left
              class="mb-3"
            >
              <b-card-text>Some quick example text to build on the card and make up the bulk of the card's content.</b-card-text>
            </b-card>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h2>Liste de tous mes articles publiés</h2>
          <div>
            <b-table striped hover :items="items"></b-table>
          </div>
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
  name: "Profile",
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
