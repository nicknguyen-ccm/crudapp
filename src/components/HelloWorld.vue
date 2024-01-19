<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
type Post = {
  _id: string,
  isComplete: boolean,
  todoName: string
}
let posts = ref<Post[]>([])
const title = ref('')
const isComplete = ref(false)
const filterQuery = ref('')


onMounted( () => {
  retrievePosts()
}) 
function retrievePosts() {
  axios.get('https://calm-plum-jaguar-tutu.cyclic.app/todos').then((result) => {
    posts.value = result.data.data
    console.log(posts)
  }).catch((error) => {console.log('error',error)})
}
function handleSubmit() {
  
  if (title.value === ''){ 
    alert('invalid title')
  } else {
    axios.post('https://calm-plum-jaguar-tutu.cyclic.app/todos',
    {
      'todoName' : title.value,
      'isComplete' : isComplete.value
    }
    ).then((result) => {
      console.log(result)
      title.value = ''
      isComplete.value = false
      retrievePosts()
    }).catch((error) => {
      console.log('error',error)
      alert('error, not submitted')
    })
  }

}
function postCheck(event:typeof event, id:string, checkStatus:boolean) {
  axios.put(`https://calm-plum-jaguar-tutu.cyclic.app/todos/${id}`, {
    'isComplete': !checkStatus
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    alert('check was not posted')
    event.target.checked = !event.target.checked
    console.log('error check not updated',error)
  })
}
function deleteHandler(id:string) {
  axios.delete(`https://calm-plum-jaguar-tutu.cyclic.app/todos/${id}`).then((result) => {
    posts.value = posts.value.filter((item) => {
      return item._id !== id
    })
    console.log(result)
  }).catch((error) => {
    console.log('error',error)
  })
}

function sort(mode:string) {
  if (mode === 'ascend') {
    posts.value = posts.value.sort((a,b) => {
      if (a.todoName < b.todoName) {
        return -1;
      }
      if (a.todoName > b.todoName) {
        return 1;
      }
      return 0;
    })
  } else {
    posts.value = posts.value.sort((a,b) => {
      if (a.todoName < b.todoName) {
        return 1;
      }
      if (a.todoName > b.todoName) {
        return -1;
      }
      return 0;
    })
  }
}
 
const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    return post.todoName.includes(filterQuery.value)
  })
})
</script>

<template>
<div class="formAndTable">
  <div>
  <label>Filter: </label>
  <input type="text" v-model="filterQuery">
  <table>
    <th>Title
      <button @click="sort('descend')"><font-awesome-icon :icon="['fas', 'arrow-up']"/></button>
      <button @click="sort('ascend')"><font-awesome-icon :icon="['fas', 'arrow-down']"/></button>

    </th>
    <th>Complete

      
    </th>
    <th>Actions</th>
    <tr v-for="post in filteredPosts" :key="post._id">
      <td>{{ post.todoName }} </td>
      <td>
        <input type="checkbox" v-bind:checked="post.isComplete" v-on:change="postCheck($event, post._id, post.isComplete)">
      </td>
      <td>
        <button v-on:click="deleteHandler(post._id)">Delete</button>
      </td>
    </tr>
  </table>
</div>
  <div class="submitForm">
    <label>Title: </label>
    <input type="text" v-model.trim="title">
    <label>Complete: </label>
    <input type="checkbox" v-model="isComplete">
    <button @click="handleSubmit">Submit</button>
  </div>
</div>




</template>

<style scoped>
.submitForm { 
  display: flex;
  flex-direction: column;
  flex-basis:auto;
  background-color: rgb(164, 172, 182);
  padding: 10px;
  border-radius: 15px;
  
}
table {
  background-color: rgb(182, 201, 231);
  border-radius: 15px;
  padding: 10px;
}
.th {
  background-color: rgb(202, 164, 164)
}
.formAndTable {
  display: flex;
  background-color:rgb(184, 189, 197);
  border-radius: 15px;
  padding: 10px;
  gap: 20px
}

</style>
