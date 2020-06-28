<template>
  <div class="profile">
    <Header />
    <b-container id="main" fluid="lg">
      <b-row class="my-5">
        <b-col cols="12" lg="4" class="d-flex justify-content-center">
          <b-card
            :img-src="avatarPreview"
            img-alt="Card image"
            img-top
            class="m-0 avatar"
            style="width: 100%; max-width: 16rem"
          >
            <form enctype="multipart/form-data">
              <input type="file" style="display:none" ref="avatarInput" @change="avatarSelected" />
              <b-button variant="outline-info" @click="selectAvatar">Change Avatar</b-button>
            </form>
          </b-card>
        </b-col>
        <b-col
          cols="12"
          lg="8"
          class="d-flex flex-column align-items-center justify-content-around"
        >
          <b-row class="mt-3">
            <h1>{{user.name}}</h1>
          </b-row>
          <b-row>
            <b-dropdown text="Manage Account" variant="info">
              <b-dropdown-item v-b-modal.modal-editAccount>Edit Account</b-dropdown-item>
              <b-dropdown-item v-b-modal.modal-changePassword>Change Password</b-dropdown-item>
              <b-dropdown-item v-b-modal.modal-deleteAccount>Delete Account</b-dropdown-item>
            </b-dropdown>

            <!-- Edit Account Modal -->
            <b-modal
              id="modal-editAccount"
              title="Edit your details"
              no-close-on-backdrop
              hide-footer
            >
              <template>
                <b-form>
                  <b-form-group id="name-group">
                    <b-form-input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      v-model="user.name"
                      
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group id="email-group">
                    <b-form-input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter you email"
                      v-model="user.email"
                    ></b-form-input>
                  </b-form-group>
                </b-form>
                <b-button type="button" @click="cancelEdit()">Cancel</b-button>
                <b-button variant="info" class="ml-3" @click="editAccount()">Update</b-button>
              </template>
            </b-modal>

            <!-- Change password Modal -->
            <b-modal
              id="modal-changePassword"
              title="Change your password"
              no-close-on-backdrop
              hide-footer
            >
              <template v-slot:default="{ cancel }">
                <b-form>
                  <b-form-group id="password-group">
                    <b-form-input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter your new Password"
                      v-model="password"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group id="confirm-password-group">
                    <b-form-input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      placeholder="Confirm your new Password"
                      v-model="confirmPassword"
                    ></b-form-input>
                  </b-form-group>
                  
                </b-form>
                <b-alert :show="showPasswordError" variant="danger">{{ passwordError }}</b-alert>
                <b-button type="button" @click="cancel()">Cancel</b-button>
                <b-button variant="info" class="ml-3" @click="changePassword()">Change</b-button>
              </template>
            </b-modal>

            <!-- Delete Account Modal -->
            
            <b-modal
              id="modal-deleteAccount"
              size="sm"
              no-close-on-backdrop
              hide-header
              hide-footer
            >
              <template v-slot:default="{ cancel }">
                <p>Are you sure you want to delete your account ?</p>
                <b-button type="button" @click="cancel()">Cancel</b-button>
                <b-button variant="danger" class="ml-3" @click="deleteUser()">Yes, delete</b-button>
              </template>
            </b-modal>
          </b-row>
        </b-col>
      </b-row>

      <!-- Liste de tous les articles publiés par l'utilisateur -->
      <b-row class="d-flex justify-content-center">
        <h2>List of all my articles</h2>
      </b-row>
      <b-row>
        <b-col
          cols="12"
          v-if="!articles"
        >You did not publish any articles... let's start publishing !</b-col>
        <b-col cols="12" class="d-lg-flex flex-row flex-wrap justify-content-around">
          <b-card
            :title="article.title"
            :img-src="article.image_url"
            img-alt="Image"
            img-top
            border-variant="secondary"
            style="max-width: 20rem; min-width: 15rem"
            class="mt-4"
            v-for="article in articles"
            :key="article.id"
          >
            <b-card-text class="d-flex flex-row justify-content-center">
              <b-button variant="info" size="sm" :to="editRoute(article.id)">Edit</b-button>
            <DeleteArticleButton class="ml-3" :articleId="article.id"/>
            </b-card-text>
          </b-card>
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
import DeleteArticleButton from "@/components/DeleteArticleButton.vue"
import axios from "axios";

// Depedencies

export default {
  name: "Profile",
  components: {
    Header,
    Footer,
    DeleteArticleButton
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  data() {
    return {
      articles: [],
      message: "",
      user: "",
      userNameBeforeEdit: '',
      avatar: "",
      avatarPreview: "",
      password:'',
      confirmPassword: '',
      passwordError: '',
      showPasswordError: false
    };
  },
  methods: {
    selectAvatar: function() {
      this.$refs.avatarInput.click();
    },
    avatarSelected(event) {
      this.avatar = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.avatar);
      reader.onload = event => {
        this.avatarPreview = event.target.result;
      };
      
      const formData = new FormData();
      formData.append("avatar", this.avatar);
      axios
        .post(
          `http://localhost:3000/api/users/profile/${this.$store.state.user.id}/avatar`,
          formData
        )
        .then(() => console.log("Avatar has changed"))
        .catch(error => console.log(error));
    },
    async editAccount(){
      try {
        const response = await axios.put(`http://localhost:3000/api/users/account/${this.$store.state.user.id}`,{
          name: this.user.name,
          email: this.user.email
        })
        console.log(response.data)
        this.$bvModal.hide('modal-editAccount')
      } catch (error) {
        console.log(error)
      }
    },
    cancelEdit(){
      this.user.name=this.userNameBeforeEdit
      this.$bvModal.hide('modal-editAccount')
    },
    async changePassword(){
      if(this.password != this.confirmPassword){
        this.passwordError = 'Passwords do not match'
        this.showPasswordError = true
        return
      }
      try {
        
      const response = await axios.put(`http://localhost:3000/api/users/password/${this.$store.state.user.id}`,{
          password: this.password,
          confirmPassword: this.confirmPassword
        })
        console.log(response.data)
        this.password = ''
        this.confirmPassword = ''
        this.showPasswordError = false
        this.$bvModal.hide('modal-changePassword')
      } catch (error) {
        console.log(error)
      }
    },
    async deleteUser() {
      try {
        axios.delete(
          `http://localhost:3000/api/users/${this.$store.getters.userId}`
        );
        this.$store.dispatch("logout");
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
    editRoute(id){
      return `/edit/${id}`
    }
  },
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/profile/${this.$store.state.user.id}`
      );
      this.articles = response.data.articles;
      this.user = response.data.user[0];
      this.userNameBeforeEdit = this.user.name
      this.avatarPreview = response.data.user[0].avatar_url;
      
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
