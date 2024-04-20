<template></template>

<script>
import { useAppStore } from "../../stores/app";

export default {
  mounted() {
    const app = useAppStore();
    app.setHeader("Downloads")
  }
}
</script>

