<template>
  <div id="admin" class="d-flex flex-column">
    <!-- Heder -->
    <Header />

    <!-- Main -->
    <b-container id="main" fluid="lg">
      <h1>Administation Page</h1>

      <b-tabs content-class="mt-3">
        <!-- We render a list of all articles -->
        <b-tab title="Articles" active>
          <b-row>
            <b-table-simple responsive>
              <b-thead head-variant="dark">
                <b-tr>
                  <b-th>Id</b-th>
                  <b-th>Title</b-th>
                  <b-th>User</b-th>
                  <b-th>Action</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr v-for="article in articles" :key="article.id">
                  <b-th>{{ article.id }}</b-th>
                  <b-th class="text-left">
                    <router-link :to="articleLink(article.id)">{{article.title}}</router-link>
                     </b-th>
                  <b-th>{{ article.name }}</b-th>
                  <b-th>
                    <b-button variant="danger" size="sm" aria-label="Delete article" @click.prevent="deleteArticle(article)">Delete</b-button>
                  </b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-row>
          
        <!-- We render a list of all users -->
        </b-tab>
        <b-tab title="Users">
          <b-row>
            <b-table-simple>
              <b-thead head-variant="dark">
                <b-tr>
                  <b-th>Id</b-th>
                  <b-th>Name</b-th>
                  <b-th>Email</b-th>
                  <b-th>Admin</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr v-for="user in users" :key="user.id">
                  <b-th>{{ user.id }}</b-th>
                  <b-th>{{ user.name }}</b-th>
                  <b-th>{{ user.email }}</b-th>
                  <b-th>
                    <b-form-checkbox v-model="user.is_admin" name="check-button" aria-label="Change admin rights" switch @input="adminRight(user)">
                    </b-form-checkbox>
                  </b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-container>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import axios from 'axios'

export default {
  name: "Admin",
  components: {
    Header,
    Footer
  },
  metaInfo: {
    title: 'Groupomania - Administation page',
    htmlAttrs: {
        lang: 'en'
      }
  },
  data() {
    return {
      users: [],
      articles: []
    }
  },
  methods: {
    // Get the link to edit/articleId
    articleLink(id) {
      return `/articles/${id}`
    },
    // Set admin rights of the user
    async adminRight(user){     
      try {
        axios.put('http://localhost:3000/api/admin',{
          userId: user.id,
          adminRight: user.is_admin
        })
      } catch (error) {
        console.log(error)
      }
    },
    // Delete an article
    async deleteArticle(article) {
      try {
        axios
          .delete(`http://localhost:3000/api/articles/${article.id}`)
          .then(response => {
            console.log(response.data);
            const indexArticle = this.articles.indexOf(article);
            this.articles.splice(indexArticle, 1);
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
  // Load the list of all users and all articles
  async mounted() {
    try {
      const response = await axios.get("http://localhost:3000/api/admin", this.$store.state.user.id);
      this.users = response.data.users;
      this.articles = response.data.articles;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="scss" scoped>
#admin {
  margin-top: 5rem;
  height: 100%;

  #main {
    flex: 1;
  }
}
</style>
