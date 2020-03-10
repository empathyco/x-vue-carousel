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
  import { MoveSlideMixin } from '@/components/mixins/move-slide';
  import NavigationGroup from '@/components/navigation-button/navigation-group.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { VueCssClasses } from '@/utils/types';
  import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

  const TIME_BETWEEN_SCROLL_EVENTS = 50;

  @Component({
    components: { Item, NavigationGroup }
  })
  export default class Slider extends Mixins(MoveSlideMixin) {
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

    @Prop({ required: true })
    minDraggingDisplacement!: number;

    @Prop({ required: true })
    activeSlideIndex!: number;

    sliderViewportWidth = 0; // Width per slide. Slider viewport width
    isAnimatingSliderToRestore = false; // Current slide is retrieving to its original position

    isStartingDragging = false; // The slide is dragging
    clickXPosition = 0; // Click X position of the mouse or touch
    mouseDisplacementInDraggingInPx = 0; // Mouse displacement in dragging regarding X position click

    baseSliderPositionInPx = 0; // Slider position in pixels (number of slides in pixels)
    currentSliderPositionInPx = 0; // Current position in pixels (depens on the mouse displacement)
    currentDisplacementDirection = SlideDirection.LEFT; // Displacement direction

    firstIndexItemCurrentSlide = 0; // Index of the first item of current slide in the viewport of the slider
    maxFirstIndexItem = 0; // Index of the first item of the last slide of the slider

    timeBetweenScrollEventsInMs = 0; // Time between scroll events to apply a new one

    mounted(): void {
      this.initSlider();
      this.addEventListeners();
    }

    beforeDestroy(): void {
      this.removeEventListeners();
    }

    protected get itemWidth(): number {
      return this.sliderViewportWidth / this.itemsPerSlide;
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

    protected get isFirstSlide(): boolean {
      return this.firstIndexItemCurrentSlide === 0;
    }

    protected get isLastSlide(): boolean {
      return this.firstIndexItemCurrentSlide === this.maxFirstIndexItem;
    }

    protected get isMouseDisplacementGreaterThanMin(): boolean {
      return Math.abs(this.mouseDisplacementInDraggingInPx) > this.minDraggingDisplacement;
    }

    @Watch('itemsPerSlide', { immediate: false })
    onItemsPerSlideChange(): void {
      this.initSlider();
    }

    @Watch('activeSlideIndex', { immediate: false })
    onActiveSlideIndexChange(newActiveSlideIndex: number, oldActiveSlideIndex: number): void {
      this.currentDisplacementDirection =
        newActiveSlideIndex < oldActiveSlideIndex ? SlideDirection.LEFT : SlideDirection.RIGHT;

      this.firstIndexItemCurrentSlide =
        newActiveSlideIndex === Math.floor(this.items.length / this.itemsPerSlide)
          ? this.maxFirstIndexItem
          : newActiveSlideIndex * this.itemsPerSlide;

      this.setCurrentSliderPosition();
    }

    addEventListeners(): void {
      window.addEventListener('mouseup', () => this.stopDrag());
      window.addEventListener('mousemove', (event: MouseEvent) => this.drag(event));

      window.addEventListener('touchend', () => this.stopDrag());
      window.addEventListener('touchmove', (event: TouchEvent) => this.drag(event));

      window.addEventListener('resize', () => this.initSliderView());
    }

    removeEventListeners(): void {
      window.removeEventListener('mouseup', () => this.stopDrag());
      window.removeEventListener('mousemove', (event: MouseEvent) => this.drag(event));

      window.removeEventListener('touchend', () => this.stopDrag());
      window.removeEventListener('touchmove', (event: TouchEvent) => this.drag(event));

      window.removeEventListener('resize', () => this.initSliderView());
    }

    initSlider(): void {
      this.initSliderView();

      this.maxFirstIndexItem =
        this.items.length - this.itemsPerSlide >= 0 ? this.items.length - this.itemsPerSlide : 0;
      this.timeBetweenScrollEventsInMs = new Date().getTime();
    }

    initSliderView(): void {
      const slider = this.$refs.slider as HTMLDivElement;
      this.sliderViewportWidth = slider.clientWidth + this.itemMarginRightInPx;

      this.currentSliderPositionInPx = 0;
      this.firstIndexItemCurrentSlide = 0;

      this.baseSliderPositionInPx = 0;
    }

    setCurrentSliderPosition(): void {
      this.currentSliderPositionInPx = -this.firstIndexItemCurrentSlide * this.itemWidth;
      this.baseSliderPositionInPx = this.currentSliderPositionInPx;
    }

    startDrag(event: MouseEvent | TouchEvent): void {
      this.isStartingDragging = true;
      this.clickXPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    }

    stopDrag(): void {
      if (this.isStartingDragging) {
        const displacementDirection =
          this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
        if (this.isMouseDisplacementGreaterThanMin && !this.isSliderLimit(displacementDirection)) {
          this.moveSlide(displacementDirection, this.activeSlideIndex);
        } else {
          this.setSliderAnimationToRestoreSlide();
          this.setCurrentSliderPosition();
        }
        this.mouseDisplacementInDraggingInPx = 0;
      }
      this.isStartingDragging = false;
    }

    drag(event: MouseEvent | TouchEvent): void {
      if (this.isStartingDragging) {
        const xPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        this.mouseDisplacementInDraggingInPx = xPosition - this.clickXPosition;
        this.currentSliderPositionInPx =
          this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
      }
    }

    scroll(wheel: WheelEvent): void {
      const timeNow = new Date().getTime();
      if (timeNow - this.timeBetweenScrollEventsInMs > TIME_BETWEEN_SCROLL_EVENTS) {
        if (wheel.deltaX > 0 || wheel.deltaY < 0) {
          this.currentSliderPositionInPx = -this.itemWidth + this.baseSliderPositionInPx;
          this.moveSlideOnScrollAnimation(SlideDirection.RIGHT);
        } else if (wheel.deltaX < 0 || wheel.deltaY > 0) {
          this.currentSliderPositionInPx = this.itemWidth + this.baseSliderPositionInPx;
          this.moveSlideOnScrollAnimation(SlideDirection.LEFT);
        }
      }
      this.timeBetweenScrollEventsInMs = timeNow;
    }

    isSliderLimit(displacementDirection: SlideDirection): boolean {
      const isLeftSliderLimit: boolean =
        this.isFirstSlide && displacementDirection === SlideDirection.LEFT;
      const isRightSliderLimit: boolean =
        this.isLastSlide && displacementDirection === SlideDirection.RIGHT;

      return isLeftSliderLimit || isRightSliderLimit;
    }

    setSliderAnimationToRestoreSlide(callback?: () => void): void {
      this.isAnimatingSliderToRestore = true;
      setTimeout(() => {
        callback?.();
        this.isAnimatingSliderToRestore = false;
      }, this.slidingAnimationTimeInMs / 2);
    }

    moveSlideOnScrollAnimation(displacementDirection: SlideDirection): void {
      if (this.isSliderLimit(displacementDirection)) {
        this.setSliderAnimationToRestoreSlide(() => this.setCurrentSliderPosition());
      } else {
        this.moveSlide(displacementDirection, this.activeSlideIndex);
      }
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
