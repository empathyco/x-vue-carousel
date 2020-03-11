<template>
  <div class="eco-navigation-group" :class="dynamicCssClasses">
    <NavigationButton
      v-bind="{ activeSlideIndex, slidingAnimationTimeInMs, navigationButtonIcon }"
      :slideDirection="slideDirections.LEFT"
      class="eco-navigation-group-left-button eco-navigation-group__left-button"
    />
    <NavigationButton
      v-bind="{ activeSlideIndex, slidingAnimationTimeInMs, navigationButtonIcon }"
      :slideDirection="slideDirections.RIGHT"
      class="eco-navigation-group-right-button eco-navigation-group__right-button"
    />
  </div>
</template>

<script lang="ts">
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { VueCssClasses } from '@/utils/types';
  import Vue, { VueConstructor } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import NavigationButton from './navigation-button.vue';

  @Component({
    components: { NavigationButton }
  })
  export default class NavigationGroup extends Vue {
    @Prop({ required: true })
    activeSlideIndex!: number;

    @Prop({ required: true })
    slidingAnimationTimeInMs!: number;

    @Prop({ required: true })
    isLastSlide!: boolean;

    @Prop({ required: true })
    navigationButtonIcon!: VueConstructor;

    slideDirections = SlideDirection; // Just to use it inside the template

    protected get dynamicCssClasses(): VueCssClasses {
      return [
        {
          'eco-navigation-group--at-start': this.activeSlideIndex === 0,
          'eco-navigation-group--at-end': this.isLastSlide
        }
      ];
    }
  }
</script>

<style lang="scss">
  @import './src/styles/theme';

  .eco-navigation-group {
    &--at-start .eco-navigation-group__left-button,
    &--at-end .eco-navigation-group__right-button {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
