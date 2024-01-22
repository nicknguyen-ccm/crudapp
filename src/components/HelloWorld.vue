<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";



type Post = {
  _id: string;
  isComplete: boolean;
  todoName: string;
};
type SortType = "ascend" | "descend" | "none";

const apiURL = "https://calm-plum-jaguar-tutu.cyclic.app/";

let posts = ref<Post[]>([]);
const filterQuery = ref("");
const sortMode = ref<SortType>("none");
const router = useRouter();

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

function checkHandler(event: Event, id: string, checkStatus: boolean) {
  axios
    .put(apiURL + `todos/${id}`, {
      isComplete: !checkStatus,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      alert("check was not posted");
      event.target.checked = !event.target.checked;
      console.log("error check not updated", error);
    });
}

function deleteHandler(id: string) {
  axios
    .delete(apiURL + `todos/${id}`)
    .then((result) => {
      posts.value = posts.value.filter((item) => {
        return item._id !== id;
      });
      console.log(result);
    })
    .catch((error) => {
      console.log("error", error);
    });
}

function detailHandler(_id: string) {
  router.push({ name: "post", params: { id: _id } });
}

const sortedPosts = computed(() => {
  if (sortMode.value === "none") {
    return filteredPosts.value
  } else if (sortMode.value === 'ascend') {
    return filteredPosts.value.toSorted((a,b) => a.todoName.localeCompare(b.todoName)).reverse()
  } else {
    return filteredPosts.value.toSorted((a,b) => a.todoName.localeCompare(b.todoName))
  }
})  

const filteredPosts = computed(() => {
  return posts.value.filter((post) => post.todoName.includes(filterQuery.value.toLowerCase()))
});

onMounted(() => {
  retrievePosts();
});
</script>

<template>
  <div class="formAndTable">
    <div>
      <div style="margin-left: 10px">
        <label>Filter: </label>
        <input type="text" v-model="filterQuery" />
        <RouterLink to="/form">
          <button>Create a Post</button>
        </RouterLink>
      </div>
      <table>
        <th>
          Title
          <button @click="sortMode='descend'">
            <font-awesome-icon :icon="['fas', 'arrow-up']" />
          </button>
          <button @click="sortMode='ascend'">
            <font-awesome-icon :icon="['fas', 'arrow-down']" />
          </button>
        </th>
        <th>Complete</th>
        <th>Actions</th>
        <tr v-for="post in sortedPosts" :key="post._id">
          <td>{{ post.todoName }}</td>
          <td>
            <input
              type="checkbox"
              :checked="post.isComplete"
              @change="checkHandler($event, post._id, post.isComplete)"
            />
          </td>
          <td>
            <button @click="detailHandler(post._id)">Edit</button>
            <button @click="deleteHandler(post._id)">Delete</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  background-color: rgb(182, 201, 231);
  border-radius: 15px;
  padding: 10px;
}

.formAndTable {
  display: flex;
  background-color: rgb(184, 189, 197);
  border-radius: 15px;
  padding: 20px;
  gap: 20px;
}
</style>
