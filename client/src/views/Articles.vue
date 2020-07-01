<template>
  <div class="articles">
    <Header v-if="isLoggedIn" />
    <b-container id="main" fluid="lg" style="max-width: 60rem">
      <b-row>
        <b-col class="d-flex justify-content-center">
          <b-card
            :img-src="article.image_url"
            img-alt="Image"
            img-top
            tag="article"
            style="width: 100%"
            class="mb-5 mt-5"
          >
            <h1>{{article.title}}</h1>
            <p class="card-subtitle text-muted mb-3">By {{ article.name }}</p>
            <b-card-text v-html="article.content" class="text-justify"></b-card-text>

            <b-button
              v-if="isOwner(article.user_id)"
              href="#"
              variant="primary"
              :to="editRoute(article.id)"
            >Edit</b-button>
            <b-button
              v-if="isOwner(article.user_id)"
              href="#"
              variant="danger"
              class="ml-3"
              @click.prevent="deleteArticle(article.id)"
            >Delete</b-button>
          </b-card>
        </b-col>
      </b-row>

      <b-row class="d-flex flex-column align-items-center">
        <b-col class="comment">
          <b-card v-for="comment in comments" :key="comment.id" class="my-2 text-left">
            <b-card-title>{{ comment.name }}:</b-card-title>
            <b-card-text>{{ comment.content }}</b-card-text>
            <b-button>Delete comment</b-button>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-3">
          <b-form-group label="Give a comment" class="text-bold text-left">
            <b-form-textarea
              id="comment"
              v-model="comment"
              placeholder="What do you think about this article ??"
              rows="3"
            ></b-form-textarea>
          </b-form-group>

          <b-button
            type="submit"
            @click.prevent="postComment(article.id)"
            variant="info"
            class="mt-2"
          >Comment !</b-button>
        </b-col>
      </b-row>
    </b-container>
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";

// Depedencies

export default {
  name: "Home",
  components: {
    Header,
    Footer
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  data() {
    return {
      article: "",
      comment: "",
      comments: ""
    };
  },
  methods: {
    isOwner: function(articleOwner) {
      if (articleOwner == this.$store.state.user.id) return true;
    },
    postComment: function(articleId) {
      this.comments.push({
        content: this.comment,
        name: this.$store.state.user.name
      });
      axios
        .post("http://localhost:3000/api/articles/comments", {
          articleId: articleId,
          userId: this.$store.getters.userId,
          content: this.comment
        })
        .then(response => {
          console.log(response.data);
          // this.$router.go();
        })
        .catch(error => console.log(error));
    },
    editRoute(id) {
      return `/edit/${id}`;
    },
    deleteArticle: async function(articleId) {
      try {
        axios
          .delete(`http://localhost:3000/api/articles/${articleId}`)
          .then(response => {
            console.log(response.data);
            this.$router.replace("/");
          });
      } catch (error) {
        console.log(error);
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/articles/${this.$route.params.id}`
      );
      this.article = response.data.article[0];
      this.comments = response.data.comments;
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="scss" scoped>
.articles {
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
