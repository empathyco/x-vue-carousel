<template>
  <div
    ref="ecoCarouselSliderWrapper"
    class="eco-carousel-slider-wrapper eco-carousel-slider__wrapper"
  >
    <section
      @touchstart.prevent.stop="startDrag($event)"
      @mousedown.prevent.stop="startDrag($event)"
      @wheel.prevent.stop="scroll($event)"
      class="eco-carousel-slider eco-carousel__slider"
      :class="sliderDynamicCssClasses"
      :style="[sliderTranslationStyle, sliderTransitionStyle]"
    >
      <Item
        v-for="item in items"
        :key="item.id"
        :item="item"
        class="eco-carousel-slider__item"
        :style="{
          width: `${itemWidthWithoutMargin}px`,
          'margin-right': `${itemMarginRightInPx}px`
        }"
      />
    </section>
  </div>
</template>

<script lang="ts">
  import Item from '@/components/item.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { VueCssClasses } from '@/utils/types';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  const TIME_BETWEEN_SCROLL_EVENTS = 50;

  @Component({
    components: { Item }
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

    sliderViewportWidth = 0; // Width per slide. Slider viewport width
    isStartingDragging = false; // The slide is dragging
    isSlidingLimitForAnimation = false; // Current slide is in the limit (right or left) and it is retrieving

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
          'eco-carousel-slider--start': this.firstIndexItemCurrentSlide === 0,
          'eco-carousel-slider--end': this.firstIndexItemCurrentSlide === this.maxFirstIndexItem
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
        }ms ease-out`
      };
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
      const sliderWrapper = this.$refs.ecoCarouselSliderWrapper as HTMLDivElement;
      this.sliderViewportWidth = sliderWrapper.clientWidth + this.itemMarginRightInPx;

      this.currentSliderPositionInPx = 0;
      this.firstIndexItemCurrentSlide = 0;

      this.baseSliderPositionInPx = 0;
    }

    startDrag(event: MouseEvent | TouchEvent) {
      this.isStartingDragging = true;
      this.clickXPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    }

    stopDrag() {
      if (this.isStartingDragging) {
        this.isStartingDragging = false;
        this.currentDisplacementDirection =
          this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
        this.moveSlide();
      }
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
        if (wheel.deltaX > 0 || wheel.deltaY < 0) {
          this.mouseDisplacementInDraggingInPx = -this.itemWidth;
        } else if (wheel.deltaX < 0 || wheel.deltaY > 0) {
          this.mouseDisplacementInDraggingInPx = this.itemWidth;
        }

        this.currentSliderPositionInPx =
          this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
        this.currentDisplacementDirection =
          this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;

        this.moveSlideOnScrollAnimation();
      }
      this.timeBetweenScrollEventsInMs = timeNow;
    }

    areSliderLimits(): boolean {
      const isLeftSliderLimit: boolean =
        this.firstIndexItemCurrentSlide === 0 &&
        this.currentDisplacementDirection === SlideDirection.LEFT;
      const isRightSliderLimit: boolean =
        this.firstIndexItemCurrentSlide === this.maxFirstIndexItem &&
        this.currentDisplacementDirection === SlideDirection.RIGHT;

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
      } else if (this.mouseDisplacementInDraggingInPx !== 0) {
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
      this.mouseDisplacementInDraggingInPx = 0;
    }
  }
</script>

<style lang="scss">
  .eco-carousel {
    &-slider {
      display: inline-flex;
      flex: 1 1 auto;
      align-items: flex-end;
      will-change: transform;

      &__item {
        flex: 1 0 auto;
      }

      &--dragging {
        transition: none !important;
      }
    }
  }
</style>
