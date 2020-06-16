<template>
  <div id="compose">
    <Header />
    <b-container>
      <h2>Ecrit un nouvel article !</h2>
      <b-row class="d-flex flex-column align-items-center">
        <b-col style="max-width: 40rem">
          <input v-model="title" type="text" name="title" placeholder="Title" />

          <!-- Implemet QUill Editor -->
          <quill-editor
            ref="myQuillEditor"
            v-model="content"
            :options="editorOption"
          />
					<b-button type="submit" variant="info" @click.prevent="newArticle">Create my article !</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// Components
import Header from "@/components/Header.vue";

// Depedencies
import axios from "axios";

export default {
  name: "Compose",
  components: {
    Header
  },
  data() {
    return {
			title: '',
      userId: this.$store.state.user.id,
			content: '',
			
      editorOption: {
        placeholder: "Please enter your content here",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
							[{ 'header': [2, 3, 4, false] }],
							['clean']
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
    isOwner: function(articleOwner) {
      if (articleOwner == this.userId) return true;
    },
    newArticle: function() {
      let article = {
        title: this.title,
        content: this.content,
        userId: this.userId
      };
      axios
        .post("http://localhost:3000/api/articles", {
          title: article.title,
          content: article.content,
          userId: article.userId
        })
        .then(response => {
          console.log(response.data);
          this.$router.push('/');
        })
        .catch(error => console.log(error));
    },
    // Quill editor methods
    
    
  }
};
</script>