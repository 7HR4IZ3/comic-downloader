<template></template>


<script>
import { useAppStore } from "../../stores/app";

export default {
  mounted() {
    const app = useAppStore();
    app.setHeader("Starred Comics");

    app.setFab({
      shown: false, action() {}
    });
  }
}
</script>
