<template>
  <div class="eco-carousel-slider-wrapper eco-carousel-slider__wrapper"
       ref="ecoCarouselSliderWrapper">
    <section class="eco-carousel-slider eco-carousel__slider"
             :class="sliderDynamicCssClasses"
             :style="sliderDynamicStyles"
             @mousedown.prevent.stop="startDrag($event)"
             @wheel.prevent.stop="scroll($event)">
      <Item v-for="item in items"
            class="eco-carousel-slider__item"
            :key="item.id"
            :item="item"
            :style="{ width: `${ itemWidthWithoutMargin }px`, 'margin-right': `${ itemMarginRightInPx }px` }"></Item>
    </section>
  </div>
</template>

<script lang="ts">
  import Item from '@/components/item.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { SlideDirection } from '@/utils/slide-direction.enum';
  import { VueCssClasses } from '@/utils/types';
  import { Component, Prop, Vue } from 'vue-property-decorator';

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
      this.slideWrapperWidth = (this.$refs.ecoCarouselSliderWrapper as Element).clientWidth + this.itemMarginRightInPx;

      this.currentSlideFirstIndexItem = 0;
      this.itemsLastSlide = this.items.length % this.itemsPerSlide || this.itemsPerSlide;
      this.maxIndexItem = (this.items.length - this.itemsPerSlide >= 0) ? this.items.length - this.itemsPerSlide : 0;

      this.timeBetweenScrollEventsInMs = new Date().getTime();

      this.addEventListeners();
    }

    beforeDestroy() {
      window.removeEventListener('mouseup', this.stopDrag);
      window.removeEventListener('mousemove', this.drag);
    }

    get itemWidth() {
      return this.slideWrapperWidth / this.itemsPerSlide;
    }

    get itemWidthWithoutMargin() {
      return this.itemWidth - this.itemMarginRightInPx;
    }

    get sliderDynamicCssClasses(): VueCssClasses {
      return [
        `eco-carousel-slider--${ this.currentDisplacementDirection }`,
        {
          'eco-carousel-slider--dragging': this.dragging,
          'eco-carousel-slider--start': this.currentSlideFirstIndexItem === 0,
          'eco-carousel-slider--end': this.currentSlideFirstIndexItem === this.maxIndexItem
        }
      ];
    }

    get sliderDynamicStyles(): Partial<CSSStyleDeclaration> {
      return {
        transform: `translate3d(${ this.currentSliderPositionInPx }px, 0, 0)`,
        transition: `transform ${ this.slidingLimit ? this.slidingAnimationTimeInMs / 2 : this.slidingAnimationTimeInMs }ms ease-out`
      };
    }

    addEventListeners() {
      window.addEventListener('mouseup', this.stopDrag);
      window.addEventListener('mousemove', this.drag);
    }

    startDrag(event: MouseEvent) {
      this.dragging = true;
      this.clickXPosition = event.clientX;
      this.mouseDisplacementInDraggingInPx = 0;
    }

    stopDrag() {
      if (this.dragging) {
        this.dragging = false;
        this.currentDisplacementDirection = this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
        this.moveSlide();
      }
    }

    drag(event: MouseEvent) {
      if (this.dragging) {
        this.mouseDisplacementInDraggingInPx = event.clientX - this.clickXPosition;
        this.currentSliderPositionInPx = this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
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
        this.currentSliderPositionInPx = this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
        this.currentDisplacementDirection = this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
        this.moveSlideOnScrollAnimation();
      }
      this.timeBetweenScrollEventsInMs = timeNow;
    }

    areSliderLimits(): boolean {
      return (this.currentSlideFirstIndexItem === 0 && this.currentDisplacementDirection === SlideDirection.LEFT) ||
        (this.currentSlideFirstIndexItem === this.maxIndexItem && this.currentDisplacementDirection === SlideDirection.RIGHT);
    }

    setSliderLimit(): void {
      this.currentSliderPositionInPx = this.currentDisplacementDirection === SlideDirection.RIGHT
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
          this.currentSlideFirstIndexItem = this.currentSlideFirstIndexItem === this.maxIndexItem
            ? this.currentSlideFirstIndexItem - this.itemsLastSlide
            : this.currentSlideFirstIndexItem - this.itemsPerSlide;
        } else {
          this.currentSlideFirstIndexItem = (this.currentSlideFirstIndexItem + this.itemsPerSlide) > this.maxIndexItem
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
