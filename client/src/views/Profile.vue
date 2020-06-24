<template>
  <div class="profile">
    <Header v-if="isLoggedIn" />
    <b-container id="main" fluid="lg">
      
      <b-row class="my-5">
        <b-col cols="12" lg="4" class="d-flex justify-content-center">
            <b-card
              :img-src="user.avatar_url"
              img-alt="Card image"
              img-top
              class="mb-3 avatar"
              style="max-width: 14rem"
            >
              <b-button variant="outline-info" v-b-modal.avatarModal>Change avatar</b-button> 
            </b-card>
            <b-modal id="avatarModal" title="Change your Profile Picture" no-close-on-backdrop>
              <UploadAvatar />
            </b-modal>
          
        </b-col>
        <b-col cols="12" lg="8" class="d-flex flex-column align-items-center justify-content-around">
          <h1>{{user.name}}</h1>
          
          <!-- Delete Account Button -->
          <b-button v-b-modal.modal-deleteAccount variant="danger" class="ml-1">Delete Account</b-button>

          <b-modal id="modal-deleteAccount" size="sm" no-close-on-backdrop hide-header hide-footer>
            
            <template v-slot:default="{ cancel }">
              <p>Are you sure you want to delete your account ?</p>
              <b-button type="button" @click="cancel()">Cancel</b-button>
              <b-button variant="danger" class="ml-3" @click="deleteUser()">Yes, delete</b-button>
            </template>

          </b-modal>

        </b-col>
      </b-row>

      <!-- Liste de tous les articles publiés par l'utilisateur -->
      <h2>Mes articles</h2>
      
      <b-row  class="d-flex flex-row justify-content-around">
        <b-card
          :title="article.title"
          :img-src="article.image_url"
          img-alt="Image"
          img-top
          border-variant="secondary"
          style="max-width: 20rem;"
          class="mt-4"
          v-for="article in articles"
          :key="article.id"
        >
          <b-card-text></b-card-text>
          <b-button variant="info">Edit</b-button>
          <b-button variant="danger" class="ml-3">Delete</b-button>
        </b-card>
      </b-row>
    </b-container>

    <!-- Footer -->
    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import UploadAvatar from "@/components/UploadAvatar.vue"
import axios from "axios";

// Depedencies

export default {
  name: "Profile",
  components: {
    Header,
    Footer,
    UploadAvatar
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  data() {
    return {
      articles: "",
      image: "",
      imagePreview: "",
      file: "",
      message: "",
      user: ''
    };
  },
  methods: {
    selectFile(){
      this.file = this.$refs.file.files[0]
    },
    async sendFile(){
      const formData = new FormData()
      formData.append('file', this.file)
      this.message = 'File has been uploaded'
      this.file = ''
      try {
        await axios.post(`http://localhost:3000/api/users/profile/${this.$route.params.id}/avatar`, formData)
      } catch (error) {
        this.message = 'Something went wrong'
        console.log(error)
      }
      
    },
    imageSelected(event) {
      this.image = event.target.files[0]

      const reader = new FileReader()
      reader.readAsDataURL(this.image)
      reader.onload = event => {
        this.imagePreview = event.target.result
      }
    },
    articlePublication(date) {
      const currentDate = Date.now()
      return currentDate - date
    },
    async deleteUser(){
      try {
        axios.delete(`http://localhost:3000/api/users/${this.$store.getters.userId}`)
        this.$store.dispatch("logout")
        this.$router.push("/")
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/profile/${this.$route.params.id}`
      );
      this.articles = response.data.articles
      this.user = response.data.user[0]
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  height: 90vh;
  margin-top: 4rem;

  #main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    

  }
}
</style>
