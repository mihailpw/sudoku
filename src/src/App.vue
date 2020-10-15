<template>
  <v-app id="app">
    <v-main>
      <v-container fluid>
        <SudokuView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SudokuView from "@/components/SudokuView.vue";

@Component({
  components: { SudokuView }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.v-expansion-panel {
  &-header {
    min-height: 24px;
    padding: 8px 24px;
  }
  &--active > &-header {
    min-height: 24px;
    padding: 8px 24px;
  }
  &-content &-content__wrap {
    padding: 0 !important;
  }
}
</style>
