<template>
  <div ref="slider" class="eco-slider" :class="dynamicCssClasses">
    <section
      ref="sliderContent"
      @touchstart="startDrag($event)"
      @mousedown.left.prevent="startDrag($event)"
      @click="preventClick($event)"
      @wheel="scroll($event)"
      class="eco-slider-content eco-slider__content"
      :style="[sliderTranslationStyle, sliderTransitionStyle]"
    >
      <slot />
    </section>
    <NavigationGroup
      v-if="withArrows"
      class="eco-slider-navigation-group eco-slider__navigation-group"
      v-bind="{
        activeSlideIndex,
        slidingAnimationTimeInMs,
        isLastSlide,
        navigationButtonIcon
      }"
    />
  </div>
</template>

<script lang="ts">
  import { SlidingMixin } from '@/components/mixins/sliding';
  import NavigationGroup from '@/components/navigation-button/navigation-group.vue';
  import { EVENTS } from '@/utils/events.const';
  import { VueCssClasses } from '@/utils/types';
  import { VueConstructor } from 'vue';
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

  @Component({
    components: { NavigationGroup }
  })
  export default class Slider extends Mixins(SlidingMixin) {
    @Prop({ required: true })
    itemMarginRightInPx!: number;

    @Prop({ required: true })
    withArrows!: boolean;

    @Prop({ required: true })
    navigationButtonIcon!: VueConstructor;

    @Watch('itemWidthWithoutMargin')
    onItemWidthOrMarginChanged(): void {
      /* Hack to append width and margin-right styles dynamically to every item passed through
       * the default slot */
      const listItems = (this.$refs.sliderContent as HTMLElement)?.children;
      for (const item of listItems) {
        item.setAttribute(
          'style',
          `width: ${this.itemWidthWithoutMargin}px; margin-right: ${this.itemMarginRightInPx}px;`
        );
      }
    }

    mounted(): void {
      this.initSliderViewport();

      this.addSlidingEventListeners();
      this.$parent.$on(EVENTS.WindowWidthChanged, () => this.initSliderViewport());
    }

    beforeDestroy(): void {
      this.removeSlidingEventListeners();
      this.$parent.$off(EVENTS.WindowWidthChanged);
    }

    protected get itemWidthWithoutMargin(): number {
      return this.itemWidth - this.itemMarginRightInPx;
    }

    protected get dynamicCssClasses(): VueCssClasses {
      return [
        `eco-slider--${this.currentDisplacementDirection}`,
        {
          /* Just we consider it is dragging if the mouse displacement is not zero to avoid disable
           * the transition animation in a second click while it is animating */
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

      * {
        flex: 1 0 auto;
        cursor: grab;
      }
    }

    &--dragging .eco-slider__content {
      transition: none !important;
    }

    &--grabbing .eco-slider__content {
      cursor: grabbing;

      * {
        cursor: grabbing;
      }
    }
  }
</style>
