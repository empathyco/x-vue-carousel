<template>
  <button
    @click="moveSlide(slideDirection, activeSlideIndex)"
    class="eco-navigation-button"
    :style="{ transition: `opacity ${slidingAnimationTimeInMs / 2}ms ease-out 0s` }"
  >
    <slot class="eco-navigation-button__icon" />
  </button>
</template>

<script lang="ts">
  import { MoveSlideMixin } from '@/components/mixins/move-slide';
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { Component, Mixins, Prop } from 'vue-property-decorator';

  @Component
  export default class NavigationButton extends Mixins(MoveSlideMixin) {
    @Prop({ required: true })
    activeSlideIndex!: number;

    @Prop({ required: true })
    slideDirection!: SlideDirection;

    @Prop({ required: true })
    slidingAnimationTimeInMs!: number;
  }
</script>

<style lang="scss">
  @import './src/styles/theme';

  .eco-navigation-button {
    position: absolute;
    top: calc(50% - #{$navigation-button-size / 2});
    width: $navigation-button-size;
    height: $navigation-button-size;
    opacity: 1;
    background: white;
    border-radius: 50%;
    border: none;
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    outline: none;
    cursor: pointer;

    &:hover {
      pointer-events: all;
    }
  }
</style>
