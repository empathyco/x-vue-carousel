<template>
  <div ref="slider" class="eco-slider" :class="dynamicCssClasses">
    <section
      @touchstart.prevent.stop="startDrag($event)"
      @mousedown.left.prevent.stop="startDrag($event)"
      @wheel.prevent.stop="scroll($event)"
      class="eco-slider-content eco-slider__content"
      :style="[sliderTranslationStyle, sliderTransitionStyle]"
    >
      <Item
        v-for="item in items"
        :key="item.id"
        :item="item"
        class="eco-slider-content__item"
        :style="{
          width: `${itemWidthWithoutMargin}px`,
          'margin-right': `${itemMarginRightInPx}px`
        }"
      />
    </section>
    <NavigationGroup
      v-if="withArrows"
      class="eco-slider-navigation-group eco-slider__navigation-group"
      v-bind="{ activeSlideIndex, slidingAnimationTimeInMs, isLastSlide }"
    />
  </div>
</template>

<script lang="ts">
  import Item from '@/components/item.vue';
  import { SlidingMixin } from '@/components/mixins/sliding';
  import NavigationGroup from '@/components/navigation-button/navigation-group.vue';
  import { VueCssClasses } from '@/utils/types';
  import { Component, Mixins, Prop } from 'vue-property-decorator';

  @Component({
    components: { Item, NavigationGroup }
  })
  export default class Slider extends Mixins(SlidingMixin) {
    @Prop({ required: true })
    itemMarginRightInPx!: number;

    @Prop({ required: true })
    withArrows!: boolean;

    mounted(): void {
      this.initSliderViewport();

      this.addSlidingEventListeners();
      window.addEventListener('resize', () => this.initSliderViewport());
    }

    beforeDestroy(): void {
      this.removeSlidingEventListeners();
      window.removeEventListener('resize', () => this.initSliderViewport());
    }

    protected get itemWidthWithoutMargin(): number {
      return this.itemWidth - this.itemMarginRightInPx;
    }

    protected get dynamicCssClasses(): VueCssClasses {
      return [
        `eco-slider--${this.currentDisplacementDirection}`,
        {
          /* Just we consider it is dragging if the mouse displacement is not zero to avoid disable
           the transition animation in a second click while it is animating */
          'eco-slider--dragging':
            this.isStartingDragging && this.mouseDisplacementInDraggingInPx !== 0,
          'eco-slider--grabbing': this.isStartingDragging,
          'eco-slider--at-start': this.isFirstSlide,
          'eco-slider--at-end': this.isLastSlide
        }
      ];
    }

    protected get sliderTranslationStyle(): Partial<CSSStyleDeclaration> {
      return { transform: `translate3d(${this.currentSliderPositionInPx}px, 0, 0)` };
    }

    protected get sliderTransitionStyle(): Partial<CSSStyleDeclaration> {
      return {
        transition: `transform ${
          this.isAnimatingSliderToRestore
            ? this.slidingAnimationTimeInMs / 2
            : this.slidingAnimationTimeInMs
        }ms ease-out 0s`
      };
    }

    initSliderViewport(): void {
      const slider = this.$refs.slider as HTMLDivElement;
      this.sliderViewportWidth = slider.clientWidth + this.itemMarginRightInPx;

      this.initSlider();
    }
  }
</script>

<style lang="scss">
  .eco-slider {
    position: relative;

    &-content {
      display: inline-flex;
      flex: 1 1 auto;
      align-items: flex-end;
      will-change: transform;
      cursor: grab;

      &__item {
        flex: 1 0 auto;
      }
    }

    &--dragging .eco-slider__content {
      transition: none !important;
    }

    &--grabbing .eco-slider__content {
      cursor: grabbing;
    }
  }
</style>
