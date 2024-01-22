<script setup lang="ts">
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import {required, helpers} from '@vuelidate/validators'
import {useVuelidate} from '@vuelidate/core'

const includeVue = (name:string) => {return name.toLowerCase().includes('vue')}
const alphaNumSpace = helpers.regex(/^[A-Za-z0-9 ]*$/)


const rules = {
    todoName: {required,
      alphaNumSpace: helpers.withMessage('Only letters, numbers, and spaces are allowed', alphaNumSpace),
      includeVue: helpers.withMessage('Must include vue in title', includeVue)},
}

const data = ref({
    todoName: '',
    isComplete: false
})

const v$ = useVuelidate(rules, data)

const route = useRoute();
const router = useRouter()
const id = ref();
const posts = ref<Post[]>([]);



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
  v$.value.$touch()
  if (!v$.value.$invalid) {
    axios.delete(apiURL + `todos/${post.value?._id}`)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log("delete error", error);
    })
    .then(() => {
      return axios.post(apiURL + "todos", { todoName: data.value.todoName , isComplete: data.value.isComplete});
    }).then((result) => {
        console.log(result)
        router.push('/')
        }).catch((error) => {
            console.log("post error", error)
        });

  }

}
</script>

<template>

  <div class="post" v-if="validPost">
    <h3>Post Details</h3>
    <p>
      Title:
      <input type="text" :placeholder="post?.todoName" v-model="data.todoName" />

    </p>
    <label class="val-error" v-if="v$?.todoName?.$invalid">{{ v$?.todoName?.$errors[0]?.$message }}</label>
    <p>
      Complete:
      <input
        type="checkbox"
        v-bind:checked="post?.isComplete"
        v-model="data.isComplete"
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
.val-error {
    color: red
}
</style>
