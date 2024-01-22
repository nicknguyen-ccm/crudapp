<script setup lang="ts">
import axios from 'axios'
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useVuelidate} from '@vuelidate/core'
import {required, helpers} from '@vuelidate/validators'


const includeVue = (name:string) => {return name.toLowerCase().includes('vue')}
const alphaNumSpace = helpers.regex(/^[A-Za-z0-9 ]*$/)

const data = ref({
    todoName: '',
    isComplete: false
})

const rules = {
    todoName: {required,
      alphaNumSpace: helpers.withMessage('Only letters, numbers, and spaces are allowed', alphaNumSpace),
      includeVue: helpers.withMessage('Must include vue in title', includeVue)},
}

const router = useRouter()
const v$ = useVuelidate(rules, data)
function handleSubmit() {
  v$.value.$touch()
  if (!v$.value.$invalid) {
    axios
      .post("https://calm-plum-jaguar-tutu.cyclic.app/todos", data.value)
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        console.log("error", error);
        alert("error, not submitted");
      });
  }
}

</script>

<template>
    <div>{{ v$.errors }}</div>
  <div class="submitForm">
    <label>Title: </label>
    <input type="text" v-model.trim="data.todoName" />
    <label class='val-error' v-if="v$?.todoName?.$invalid">{{ v$?.todoName?.$errors[0]?.$message }}</label>
    <label>Complete: </label>
    <input type="checkbox" v-model="data.isComplete" />
    <button @click="handleSubmit">Submit</button>
  </div>
</template>

<style>
.submitForm {
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
