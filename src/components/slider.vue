import { SlideDirection } from '@/utils/slide-direction.enum';
<template>
  <div
    ref="ecoCarouselSlider"
    class="eco-carousel-slider eco-carousel__slider"
    :class="sliderDynamicCssClasses"
  >
    <section
      @touchstart.prevent.stop="startDrag($event)"
      @mousedown.left.prevent.stop="startDrag($event)"
      @wheel.prevent.stop="scroll($event)"
      class="eco-carousel-slider-content eco-carousel-slider__content"
      :style="[sliderTranslationStyle, sliderTransitionStyle]"
    >
      <Item
        v-for="item in items"
        :key="item.id"
        :item="item"
        class="eco-carousel-slider-content__item"
        :style="{
          width: `${itemWidthWithoutMargin}px`,
          'margin-right': `${itemMarginRightInPx}px`
        }"
      />
    </section>
    <button
      v-if="withArrows"
      @click="clickSlideButton(slideDirections.LEFT)"
      class="eco-carousel-slider-left-button eco-carousel-slider__left-button"
      :style="{ transition: `opacity ${slidingAnimationTimeInMs / 2}ms ease-out 0s` }"
    >
      <ChevronIcon class="eco-carousel-slider-left-button__arrow-icon left-arrow-icon" />
    </button>
    <button
      v-if="withArrows"
      @click="clickSlideButton(slideDirections.RIGHT)"
      class="eco-carousel-slider-right-button eco-carousel-slider__right-button"
      :style="{ transition: `opacity ${slidingAnimationTimeInMs / 2}ms ease-out 0s` }"
    >
      <ChevronIcon class="eco-carousel-slider-right-button__arrow-icon right-arrow-icon" />
    </button>
  </div>
</template>

<script lang="ts">
  import ChevronIcon from '@/components/icons/chevron.vue';
  import Item from '@/components/item.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { VueCssClasses } from '@/utils/types';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  const TIME_BETWEEN_SCROLL_EVENTS = 50;

  @Component({
    components: { Item, ChevronIcon }
  })
  export default class Slider extends Vue {
    @Prop({ required: true })
    items!: ItemModel[];

    @Prop({ required: true })
    itemsPerSlide!: number;

    @Prop({ required: true })
    itemMarginRightInPx!: number;

    @Prop({ required: true })
    withArrows!: boolean;

    @Prop({ required: true })
    slidingAnimationTimeInMs!: number;

    slideDirections = SlideDirection; // Just to use it inside the template

    sliderViewportWidth = 0; // Width per slide. Slider viewport width
    isSlidingLimitForAnimation = false; // Current slide is in the limit (right or left) and it is retrieving

    isStartingDragging = false; // The slide is dragging
    clickXPosition = 0; // Click X position of the mouse or touch
    mouseDisplacementInDraggingInPx = 0; // Mouse displacement in dragging regarding X position click

    baseSliderPositionInPx = 0; // Slider position in pixels (number of slides in pixels)
    currentSliderPositionInPx = 0; // Current position in pixels (depens on the mouse displacement)
    currentDisplacementDirection = SlideDirection.LEFT; // Displacement direction

    firstIndexItemCurrentSlide = 0; // Index of the first item of current slide in the viewport of the slider
    itemsLastSlide = 0; // Items of the last slide
    maxFirstIndexItem = 0; // Index of the first item of the last slide of the slider

    timeBetweenScrollEventsInMs = 0; // Time between scroll events to apply a new one

    mounted() {
      this.initSlider();
      this.addEventListeners();
    }

    beforeDestroy() {
      this.removeEventListeners();
    }

    get itemWidth() {
      return this.sliderViewportWidth / this.itemsPerSlide;
    }

    get itemWidthWithoutMargin() {
      return this.itemWidth - this.itemMarginRightInPx;
    }

    get sliderDynamicCssClasses(): VueCssClasses {
      return [
        `eco-carousel-slider--${this.currentDisplacementDirection}`,
        {
          /* Just we consider it is dragging if the mouse displacement is not zero to avoid disable
          the transition animation in a second click while it is animating */
          'eco-carousel-slider--dragging':
            this.isStartingDragging && this.mouseDisplacementInDraggingInPx !== 0,
          'eco-carousel-slider--grabbing': this.isStartingDragging,
          'eco-carousel-slider--at-start': this.isFirstSlide,
          'eco-carousel-slider--at-end': this.isLastSlide
        }
      ];
    }

    get sliderTranslationStyle(): Partial<CSSStyleDeclaration> {
      return { transform: `translate3d(${this.currentSliderPositionInPx}px, 0, 0)` };
    }

    get sliderTransitionStyle(): Partial<CSSStyleDeclaration> {
      return {
        transition: `transform ${
          this.isSlidingLimitForAnimation
            ? this.slidingAnimationTimeInMs / 2
            : this.slidingAnimationTimeInMs
        }ms ease-out 0s`
      };
    }

    get isFirstSlide(): boolean {
      return this.firstIndexItemCurrentSlide === 0;
    }

    get isLastSlide(): boolean {
      return this.firstIndexItemCurrentSlide === this.maxFirstIndexItem;
    }

    @Watch('itemsPerSlide', { immediate: false })
    onItemsPerSlideChange() {
      this.initSlider();
    }

    addEventListeners() {
      window.addEventListener('mouseup', this.stopDrag);
      window.addEventListener('mousemove', this.drag);

      window.addEventListener('touchend', this.stopDrag);
      window.addEventListener('touchmove', this.drag);

      window.addEventListener('resize', this.initSliderView);
    }

    removeEventListeners() {
      window.removeEventListener('mouseup', this.stopDrag);
      window.removeEventListener('mousemove', this.drag);

      window.removeEventListener('touchend', this.stopDrag);
      window.removeEventListener('touchmove', this.drag);

      window.removeEventListener('resize', this.initSliderView);
    }

    initSlider() {
      this.initSliderView();

      this.itemsLastSlide = this.items.length % this.itemsPerSlide || this.itemsPerSlide;
      this.maxFirstIndexItem =
        this.items.length - this.itemsPerSlide >= 0 ? this.items.length - this.itemsPerSlide : 0;

      this.timeBetweenScrollEventsInMs = new Date().getTime();
    }

    initSliderView() {
      const slider = this.$refs.ecoCarouselSlider as HTMLDivElement;
      this.sliderViewportWidth = slider.clientWidth + this.itemMarginRightInPx;

      this.currentSliderPositionInPx = 0;
      this.firstIndexItemCurrentSlide = 0;

      this.baseSliderPositionInPx = 0;
    }

    startDrag(event: MouseEvent | TouchEvent) {
      this.isStartingDragging = true;
      this.clickXPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    }

    stopDrag() {
      if (this.isStartingDragging && this.mouseDisplacementInDraggingInPx !== 0) {
        this.currentDisplacementDirection =
          this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
        this.moveSlide();
        this.mouseDisplacementInDraggingInPx = 0;
      }
      this.isStartingDragging = false;
    }

    drag(event: MouseEvent | TouchEvent) {
      if (this.isStartingDragging) {
        const xPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        this.mouseDisplacementInDraggingInPx = xPosition - this.clickXPosition;
        this.currentSliderPositionInPx =
          this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
      }
    }

    scroll(wheel: WheelEvent) {
      const timeNow = new Date().getTime();
      if (timeNow - this.timeBetweenScrollEventsInMs > TIME_BETWEEN_SCROLL_EVENTS) {
        let displacement = 0;
        if (wheel.deltaX > 0 || wheel.deltaY < 0) {
          displacement = -this.itemWidth;
          this.currentDisplacementDirection = SlideDirection.RIGHT;
        } else if (wheel.deltaX < 0 || wheel.deltaY > 0) {
          displacement = this.itemWidth;
          this.currentDisplacementDirection = SlideDirection.LEFT;
        }

        this.currentSliderPositionInPx = displacement + this.baseSliderPositionInPx;
        this.moveSlideOnScrollAnimation();
      }
      this.timeBetweenScrollEventsInMs = timeNow;
    }

    clickSlideButton(slideDirection: SlideDirection): void {
      this.currentDisplacementDirection = slideDirection;
      this.moveSlide();
    }

    areSliderLimits(): boolean {
      const isLeftSliderLimit: boolean =
        this.isFirstSlide && this.currentDisplacementDirection === SlideDirection.LEFT;
      const isRightSliderLimit: boolean =
        this.isLastSlide && this.currentDisplacementDirection === SlideDirection.RIGHT;

      return isLeftSliderLimit || isRightSliderLimit;
    }

    setSliderLimit(): void {
      this.currentSliderPositionInPx =
        this.currentDisplacementDirection === SlideDirection.RIGHT
          ? -this.firstIndexItemCurrentSlide * this.itemWidth
          : 0;
    }

    moveSlideOnScrollAnimation(): void {
      if (this.areSliderLimits()) {
        this.isSlidingLimitForAnimation = true;
        setTimeout(() => {
          this.isSlidingLimitForAnimation = false;
          this.moveSlide();
        }, this.slidingAnimationTimeInMs / 2);
      } else {
        this.moveSlide();
      }
    }

    moveSlide(): void {
      if (this.areSliderLimits()) {
        this.setSliderLimit();
      } else {
        if (this.currentDisplacementDirection === SlideDirection.LEFT) {
          this.firstIndexItemCurrentSlide =
            this.firstIndexItemCurrentSlide === this.maxFirstIndexItem
              ? this.firstIndexItemCurrentSlide - this.itemsLastSlide
              : this.firstIndexItemCurrentSlide - this.itemsPerSlide;
        } else {
          this.firstIndexItemCurrentSlide =
            this.firstIndexItemCurrentSlide + this.itemsPerSlide > this.maxFirstIndexItem
              ? this.firstIndexItemCurrentSlide + this.itemsLastSlide
              : this.firstIndexItemCurrentSlide + this.itemsPerSlide;
        }
        this.currentSliderPositionInPx = -this.firstIndexItemCurrentSlide * this.itemWidth;
      }
      this.baseSliderPositionInPx = this.currentSliderPositionInPx;
    }
  }
</script>

<style lang="scss">
  $button-size: 40px;
  $button-margin: 5px;

  .eco-carousel-slider {
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

    &__left-button,
    &__right-button {
      position: absolute;
      top: calc(50% - #{$button-size / 2});
      width: $button-size;
      height: $button-size;
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

    &__left-button {
      left: $button-margin;
    }

    &__right-button {
      right: $button-margin;
    }

    &--dragging .eco-carousel-slider__content {
      transition: none !important;
    }

    &--grabbing .eco-carousel-slider__content {
      cursor: grabbing;
    }

    &--at-start .eco-carousel-slider__left-button {
      opacity: 0;
      pointer-events: none;
    }

    &--at-end .eco-carousel-slider__right-button {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
