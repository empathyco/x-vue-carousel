<template>
  <div
    ref="ecoCarouselSliderWrapper"
    class="eco-carousel-slider-wrapper eco-carousel-slider__wrapper"
  >
    <section
      @touchstart.prevent.stop="startDrag($event)"
      @wheel.prevent.stop="scroll($event)"
      @mousedown.prevent.stop="startDrag($event)"
      class="eco-carousel-slider eco-carousel__slider"
      :class="sliderDynamicCssClasses"
      :style="sliderDynamicStyles"
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

    slideWrapperWidth = 0;
    dragging = false;
    slidingLimit = false;

    clickXPosition = 0;
    mouseDisplacementInDraggingInPx = 0;
    baseSliderPositionInPx = 0;
    currentSliderPositionInPx = 0;
    currentDisplacementDirection = SlideDirection.LEFT;

    currentSlideFirstIndexItem = 0;
    itemsLastSlide = 0;
    maxIndexItem = 0;

    timeBetweenScrollEventsInMs = 0;

    mounted() {
      this.initSlider();
      this.addEventListeners();
    }

    beforeDestroy() {
      window.removeEventListener('mouseup', this.stopDrag);
      window.removeEventListener('mousemove', this.drag);

      window.removeEventListener('touchend', this.stopDrag);
      window.removeEventListener('touchmove', this.drag);
    }

    get itemWidth() {
      return this.slideWrapperWidth / this.itemsPerSlide;
    }

    get itemWidthWithoutMargin() {
      return this.itemWidth - this.itemMarginRightInPx;
    }

    get sliderDynamicCssClasses(): VueCssClasses {
      return [
        `eco-carousel-slider--${this.currentDisplacementDirection}`,
        {
          'eco-carousel-slider--dragging': this.dragging,
          'eco-carousel-slider--start': this.currentSlideFirstIndexItem === 0,
          'eco-carousel-slider--end': this.currentSlideFirstIndexItem === this.maxIndexItem
        }
      ];
    }

    get sliderDynamicStyles(): Partial<CSSStyleDeclaration> {
      return {
        transform: `translate3d(${this.currentSliderPositionInPx}px, 0, 0)`,
        transition: `transform ${
          this.slidingLimit ? this.slidingAnimationTimeInMs / 2 : this.slidingAnimationTimeInMs
        }ms ease-out`
      };
    }

    @Watch('itemsPerSlide')
    onItemsPerSlideChange() {
      this.initSlider();
    }

    initSlider() {
      const wrapper = this.$refs.ecoCarouselSliderWrapper as Element;
      this.slideWrapperWidth = wrapper.clientWidth + this.itemMarginRightInPx;
      this.currentSliderPositionInPx = 0;

      this.currentSlideFirstIndexItem = 0;
      this.itemsLastSlide = this.items.length % this.itemsPerSlide || this.itemsPerSlide;
      this.maxIndexItem =
        this.items.length - this.itemsPerSlide >= 0 ? this.items.length - this.itemsPerSlide : 0;

      this.timeBetweenScrollEventsInMs = new Date().getTime();
    }

    addEventListeners() {
      window.addEventListener('mouseup', this.stopDrag);
      window.addEventListener('mousemove', this.drag);

      window.addEventListener('touchend', this.stopDrag);
      window.addEventListener('touchmove', this.drag);
    }

    startDrag(event: MouseEvent | TouchEvent) {
      this.dragging = true;
      this.clickXPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      this.mouseDisplacementInDraggingInPx = 0;
    }

    stopDrag() {
      if (this.dragging) {
        this.dragging = false;
        this.currentDisplacementDirection =
          this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
        this.moveSlide();
      }
    }

    drag(event: MouseEvent | TouchEvent) {
      if (this.dragging) {
        const xPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        this.mouseDisplacementInDraggingInPx = xPosition - this.clickXPosition;
        this.currentSliderPositionInPx =
          this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
      }
    }

    scroll(wheel: WheelEvent) {
      const timeNow = new Date().getTime();
      if (timeNow - this.timeBetweenScrollEventsInMs > TIME_BETWEEN_SCROLL_EVENTS) {
        this.timeBetweenScrollEventsInMs = timeNow;
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
        this.currentSlideFirstIndexItem === 0 &&
        this.currentDisplacementDirection === SlideDirection.LEFT;
      const isRightSliderLimit: boolean =
        this.currentSlideFirstIndexItem === this.maxIndexItem &&
        this.currentDisplacementDirection === SlideDirection.RIGHT;

      return isLeftSliderLimit || isRightSliderLimit;
    }

    setSliderLimit(): void {
      this.currentSliderPositionInPx =
        this.currentDisplacementDirection === SlideDirection.RIGHT
          ? -this.currentSlideFirstIndexItem * this.itemWidth
          : 0;
    }

    moveSlideOnScrollAnimation(): void {
      if (this.areSliderLimits()) {
        this.slidingLimit = true;
        setTimeout(() => {
          this.slidingLimit = false;
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
          this.currentSlideFirstIndexItem =
            this.currentSlideFirstIndexItem === this.maxIndexItem
              ? this.currentSlideFirstIndexItem - this.itemsLastSlide
              : this.currentSlideFirstIndexItem - this.itemsPerSlide;
        } else {
          this.currentSlideFirstIndexItem =
            this.currentSlideFirstIndexItem + this.itemsPerSlide > this.maxIndexItem
              ? this.currentSlideFirstIndexItem + this.itemsLastSlide
              : this.currentSlideFirstIndexItem + this.itemsPerSlide;
        }
        this.currentSliderPositionInPx = -this.currentSlideFirstIndexItem * this.itemWidth;
      }
      this.baseSliderPositionInPx = this.currentSliderPositionInPx;
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
