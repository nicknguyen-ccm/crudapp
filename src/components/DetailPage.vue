<script setup lang="ts">
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";

const route = useRoute();
const router = useRouter()
const id = ref();
const posts = ref<Post[]>([]);
const title = ref("");
const checked = ref(false);

const apiURL = "https://calm-plum-jaguar-tutu.cyclic.app/";
type Post = {
  _id: string;
  isComplete: boolean;
  todoName: string;
};

function retrievePosts() {
  axios
    .get(apiURL + "todos")
    .then((result) => {
      posts.value = result.data.data;
      console.log(posts.value);
    })
    .catch((error) => {
      console.log("error", error);
    });
}

onMounted(() => {
  retrievePosts();
  id.value = route.params.id;
});

const post = computed(() => {
  return posts.value.find((item) => {
    return item._id === id.value;
  });
});

const validPost = computed(() => {
  if (post !== undefined) {
    return true;
  } else {
    return false;
  }
});

function editTitle() {
  // actually deletes original post and makes a new post
  console.log(apiURL+`todos/${post.value?._id}`)
  axios
    .delete(apiURL + `todos/${post.value?._id}`)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log("delete error", error);
    })
    .then(() => {
      return axios.post(apiURL + "todos", { todoName: title.value, isComplete: checked.value});
    }).then((result) => {
        console.log(result)
        router.push('/')
        }).catch((error) => {
            console.log("post error", error)
        });

}
</script>

<template>
  <div class="post" v-if="validPost">
    <h3>Post Details</h3>
    <p>
      Title:
      <input type="text" :placeholder="post?.todoName" v-model="title" />
    </p>
    <p>
      Complete:
      <input
        type="checkbox"
        v-bind:checked="post?.isComplete"
        v-model="checked"
      />
    </p>

    <button @click="editTitle">Submit Edit</button>
  </div>
  <p v-else>Error: Post not found</p>
</template>

<style>
.post {
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  background-color: rgb(164, 172, 182);
  padding: 10px;
  border-radius: 15px;
}
</style>
