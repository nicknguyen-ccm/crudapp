<script setup lang="ts">
import {useRoute} from 'vue-router'
import { onMounted, ref } from 'vue';

const route = useRoute()
const id = ref()

onMounted( () => {
    id.value = route.params
})
</script>

<template>
    <h1>{{ id.id }}</h1>
</template>