<script setup>
import { RouterView, RouterLink } from "vue-router";
import Toolbar from "primevue/toolbar";
import { useGuardianStore } from "./stores/guardian";

const store = useGuardianStore();
</script>

<template>
  <Toolbar class="bg-primary text-white rounded-none">
    <template #start>
      <span class="mr-1">SafeteeCall by Safeteefy.io</span>
      <div class="space-x-1">
        <RouterLink to="/home" class="text-white underline-none">
          Home
        </RouterLink>
        <RouterLink
          v-if="!!store.$state['id']"
          :to="`/guardians/${store.$state['id']}/urgencies`"
          class="text-white underline-none">
          Urgencies
        </RouterLink>
      </div>
    </template>

    <template #end>
      <span v-if="!!store.$state['id']">
        {{ store.$state["username"] }}
      </span>
    </template>
  </Toolbar>
  <main class="p-1">
    <RouterView />
  </main>
</template>

<style>
@import "primevue/resources/themes/md-light-indigo/theme.css";
@import "primevue/resources/primevue.min.css";
@import "primeicons/primeicons.css";
@import "@/assets/base.css";
</style>
