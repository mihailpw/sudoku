<template>
  <span
    :class="{ rotating: rotating }"
    :style="{ 'animation-duration': interval + 'ms' }"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { executeRepeatedly } from "@/utils";

@Component
export default class Rotation extends Vue {
  @Prop({ default: true }) public readonly active!: boolean;
  @Prop({ default: 1000 }) public readonly interval!: number;
  private rotating = false;

  protected created() {
    this.runRotationIfRequired();
  }

  @Watch("active")
  private onShownChanged() {
    this.runRotationIfRequired();
  }

  private runRotationIfRequired() {
    if (this.active && !this.rotating) {
      this.rotating = true;
      const disposeExecution = executeRepeatedly(() => {
        if (!this.active) {
          this.rotating = false;
          disposeExecution();
        }
      }, this.interval);
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.rotating {
  animation-name: rotating;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>
