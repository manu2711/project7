<template>
  <div id="edit">
    <Header />
    <b-container>

        <h1>Edit article</h1>
      <b-row class="d-flex flex-column align-items-center">
        <b-col style="max-width: 60rem">
          <form enctype="multipart/form-data" @submit.prevent="editArticle">
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

            <b-button class="mt-2" type="submit" variant="info">Update article</b-button>
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
  data() {
    return {
      title: "",
      userId: this.$store.state.user.id,
      content: "",
      image: "",
      imagePreview: "",
      article: '',

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
    async editArticle() {
      const formData = new FormData();
      formData.append("cover", this.image);
      formData.append("title", this.title);
      formData.append("content", this.content);

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
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/articles/edit/${this.$route.params.id}`
      );
      const article = response.data[0];
      this.title = article.title
      this.content = article.content
      this.imagePreview = article.image_url
      console.log(this.article)
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="scss">
#edit {
  margin-top: 4rem;
}

.ql-editor {
  min-height: 10rem;
  font-size: 1rem;
}

legend {
  font-weight: bold;
}
</style>