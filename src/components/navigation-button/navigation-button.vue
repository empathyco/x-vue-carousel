<template>
  <button
    @click="moveSlide(slideDirection)"
    class="eco-navigation-button"
    :class="dynamicCssClassesButton"
    :style="{ transition: `opacity ${slidingAnimationTimeInMs / 2}ms ease-out 0s` }"
  >
    <component
      :is="navigationButtonIcon"
      class="eco-navigation-button__icon"
      :class="dynamicCssClassesIcon"
    />
  </button>
</template>

<script lang="ts">
  import { MoveSlideMixin } from '@/components/mixins/move-slide';
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { VueCssClasses } from '@/utils/types';
  import { VueConstructor } from 'vue';
  import { Component, Mixins, Prop } from 'vue-property-decorator';

  @Component
  export default class NavigationButton extends Mixins(MoveSlideMixin) {
    @Prop({ required: true })
    slideDirection!: SlideDirection;

    @Prop({ required: true })
    slidingAnimationTimeInMs!: number;

    @Prop({ required: true })
    navigationButtonIcon!: VueConstructor;

    protected get dynamicCssClassesButton(): VueCssClasses {
      return [
        {
          'eco-navigation-button__left': this.slideDirection === SlideDirection.LEFT,
          'eco-navigation-button__right': this.slideDirection === SlideDirection.RIGHT
        }
      ];
    }

    protected get dynamicCssClassesIcon(): VueCssClasses {
      return [
        {
          'eco-navigation-left-button__arrow-icon left-arrow-icon':
            this.slideDirection === SlideDirection.LEFT,
          'eco-navigation-right-button__arrow-icon right-arrow-icon':
            this.slideDirection === SlideDirection.RIGHT
        }
      ];
    }
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

    &__left {
      left: $navigation-button-margin;
    }

    &__right {
      right: $navigation-button-margin;
    }
  }
</style>
