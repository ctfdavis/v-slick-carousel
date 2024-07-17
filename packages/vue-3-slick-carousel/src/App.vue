<script setup lang="ts"></script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/example">Example</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss"></style>
