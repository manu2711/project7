<template>
  <div id="edit">

    <!-- header -->
    <Header />

    <!-- Main -->
    <b-container>
        <h1>Edit article</h1>
      <b-row class="d-flex flex-column align-items-center">
        <b-col class="article-image" >
          <form enctype="multipart/form-data" @submit.prevent="editArticle">
            <!-- Cover image -->
            <b-form-group label="Image cover" class="text-left">
              <div v-if="imagePreview">
                <img :src="imagePreview" class="figure-img img-fluid" alt="Article cover image" />
              </div>

              <b-button variant="primary" aria-label="Upload image cover" @click="pickFile">Upload image cover</b-button>
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
            <b-form-group label="Title" label-for="title" class="text-left">
              <b-form-input
                v-model="title"
                type="text"
                id="title"
                name="title"
                placeholder="Give your article a nice title here..."
                class="my-2"
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Content" label-for="content" class="text-left">
              <!-- Implemet QUill Editor -->
              <quill-editor ref="myQuillEditor" id="content" v-model="content" :options="editorOption"></quill-editor>
            </b-form-group>
            <b-alert variant="danger" :show="errorShow" >{{ errorMessage }}</b-alert>
            <b-button class="mt-2" type="submit" variant="info" aria-label="Update article">Update article</b-button>
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
  name: "Edit",
  components: {
    Header,
    Footer
  },
  metaInfo: {
    title: 'Groupomania - Edit article',
    htmlAttrs: {
        lang: 'en'
      }
  },
  data() {
    return {
      title: "",
      userId: this.$store.state.user.id,
      content: "",
      image: "",
      imagePreview: "",
      article: '',
      errorMessage: '',
      errorShow: false,

      // Editor options
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
    // Select a file
    pickFile: function() {
      this.$refs.fileInput.click();
    },
    // Show selected image
    imageSelected(event) {
      this.image = event.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.image);
      reader.onload = event => {
        this.imagePreview = event.target.result;
      };
    },
    // Edit Article
    async editArticle() {
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

      try {
        const postResponse = await axios.put(
          `http://localhost:3000/api/articles/${this.$route.params.id}`,
          formData
        );
        console.log(postResponse);
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },
  },
  // Display article to edit
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/articles/edit/${this.$route.params.id}`
      );

      const article = response.data[0];

      if (article.user_id !== this.$store.state.user.id) {
        this.$router.push('/')
      }
      this.title = article.title
      this.content = article.content
      this.imagePreview = article.image_url
      this.article = response.data[0]
      console.log(this.article)
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="scss">
#edit {
  margin-top: 5rem;
}
.article-image {
  max-width: 60rem
}

.ql-editor {
  min-height: 10rem;
  font-size: 1rem;
}

legend {
  font-weight: bold;
}
</style>