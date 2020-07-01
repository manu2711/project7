<template>
  <div id="compose" class="d-flex flex-column">
    <Header />
    <b-container id="main" fluid="lg">
      <h1>Write your article</h1>
      <b-row class="d-flex flex-column align-items-center">
        <b-col style="max-width: 60rem">
          <form enctype="multipart/form-data" @submit.prevent="newArticle">
            <!-- Cover image -->
            <b-form-group label="Image cover" class="text-left">
              <div v-if="imagePreview">
                <img :src="imagePreview" class="figure-img img-fluid" alt="Profile picture" />
              </div>

              <b-button variant="primary" @click="pickFile">Upload image cover</b-button>
              <input
                type="file"
                @change="imageSelected"
                class="custom-file-input"
                id="customFile"
                style="display: none"
                ref="fileInput"
              />
            </b-form-group>

            <!-- Title -->
            <b-form-group label="Title" class="text-left">
              <b-form-input
                v-model="title"
                type="text"
                name="title"
                placeholder="Give your article a nice title here..."
                class="my-2"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Content" class="text-left">
              <!-- Implemet QUill Editor -->
              <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption"></quill-editor>
            </b-form-group>
            <b-alert variant="danger" :show="errorShow">{{ errorMessage }}</b-alert>
            <b-button class="mt-2" type="submit" variant="info">Create my article !</b-button>
          </form>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<script>
// Components
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

// Depedencies
import axios from "axios";

export default {
  name: "Compose",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      title: "",
      userId: this.$store.state.user.id,
      content: "",
      image: "",
      imagePreview: "",
      errorMessage: '',
      errorShow: false,

      editorOption: {
        placeholder: "Please enter your content here",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ header: [2, 3, 4, false] }],
              ["clean"]
            ]
          },
          history: {
            delay: 2000,
            maxStack: 100,
            userOnly: true
          }
        }
      }
    };
  },
  methods: {
    pickFile: function() {
      this.$refs.fileInput.click();
    },
    isOwner: function(articleOwner) {
      if (articleOwner == this.userId) return true;
    },
    imageSelected(event) {
      this.image = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.image);
      reader.onload = event => {
        this.imagePreview = event.target.result;
      };
    },
    // Création de la fonction escapeHTML pour empêcher les injections sql

    async newArticle() {
      if(!this.title | !this.content) {
        this.errorMessage = 'Please write a title and a content'
        this.errorShow = true
        return
      }

      // Création de la fonction escapeScript pour empêcher les injections script
      const escapeScript = (text) => {
        return text.replace(/script/g, '&script;')
      }

      const formData = new FormData();
      formData.append("cover", this.image);
      formData.append("title", escapeScript(this.title));
      formData.append("content", escapeScript(this.content));
      formData.append("userId", this.userId);

      try {
        const postResponse = await axios.post(
          "http://localhost:3000/api/articles",
          formData
        );
        console.log(postResponse);
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss">
#compose {
  margin-top: 5rem;
  height: 100%;

  #main {
    flex: 1;
  }
}

.ql-editor {
  min-height: 10rem;
  font-size: 1rem;
}

legend {
  font-weight: bold;
}
</style>