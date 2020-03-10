<template>
  <div class="eco-navigation-group" :class="dynamicCssClasses">
    <NavigationButton
      v-bind="{ activeSlideIndex, slidingAnimationTimeInMs }"
      :slideDirection="slideDirections.LEFT"
      class="eco-navigation-group-left-button eco-navigation-group__left-button"
    >
      <ChevronIcon class="eco-navigation-group-left-button__arrow-icon left-arrow-icon" />
    </NavigationButton>
    <NavigationButton
      v-bind="{ activeSlideIndex, slidingAnimationTimeInMs }"
      :slideDirection="slideDirections.RIGHT"
      class="eco-navigation-group-right-button eco-navigation-group__right-button"
    >
      <ChevronIcon class="eco-navigation-group-right-button__arrow-icon right-arrow-icon" />
    </NavigationButton>
  </div>
</template>

<script lang="ts">
  import { ChevronIcon } from '@/components/icons';
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { VueCssClasses } from '@/utils/types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import NavigationButton from './navigation-button.vue';

  @Component({
    components: { ChevronIcon, NavigationButton }
  })
  export default class NavigationGroup extends Vue {
    @Prop({ required: true })
    activeSlideIndex!: number;

    @Prop({ required: true })
    slidingAnimationTimeInMs!: number;

    @Prop({ required: true })
    isLastSlide!: boolean;

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
    &__left-button {
      left: $navigation-button-margin;
    }

    &__right-button {
      right: $navigation-button-margin;
    }

    &--at-start .eco-navigation-group__left-button,
    &--at-end .eco-navigation-group__right-button {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
