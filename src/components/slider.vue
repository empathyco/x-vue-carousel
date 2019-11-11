<template>
  <div class="eco-carousel-slider-wrapper eco-carousel-slider__wrapper"
           ref="ecoCarouselSliderWrapper">
    <section class="eco-carousel-slider eco-carousel__slider"
             :class="{ 'eco-carousel-slider__dragging': dragging }"
             :style="{ transform: `translate3d(${ currentSliderPositionInPx }px, 0, 0)` }"
             @mousedown.prevent="startDrag($event)">
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
  import { Component, Prop, Vue } from 'vue-property-decorator';

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

    slideWrapperWidth = 0;
    dragging = false;

    clickXPosition = 0;
    mouseDisplacementInDraggingInPx = 0;
    baseSliderPositionInPx = 0;
    currentSliderPositionInPx = 0;
    currentDisplacementDirection!: SlideDirection;

    currentSlideFirstIndexItem = 0;
    itemsLastSlide = 0;
    maxIndexItem = 0;

    mounted() {
      this.slideWrapperWidth = (this.$refs.ecoCarouselSliderWrapper as Element).clientWidth + this.itemMarginRightInPx;
      this.currentSlideFirstIndexItem = 0;
      this.itemsLastSlide = this.items.length % this.itemsPerSlide;
      this.maxIndexItem = this.items.length - this.itemsPerSlide;

      this.addEventListeners();
    }

    get itemWidth() {
      return this.slideWrapperWidth / this.itemsPerSlide;
    }

    get itemWidthWithoutMargin() {
      return this.itemWidth - this.itemMarginRightInPx;
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
        this.baseSliderPositionInPx = this.currentSliderPositionInPx;
      }
    }

    drag(event: MouseEvent) {
      if (this.dragging) {
        this.mouseDisplacementInDraggingInPx = event.clientX - this.clickXPosition;
        this.currentSliderPositionInPx = this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
      }
    }

    areSliderLimits(): boolean {
      if (this.currentSlideFirstIndexItem === 0 && this.currentDisplacementDirection === SlideDirection.LEFT) {
        this.currentSliderPositionInPx = 0;
        return true;
      }
      if (this.currentSlideFirstIndexItem === this.maxIndexItem && this.currentDisplacementDirection === SlideDirection.RIGHT) {
        this.currentSliderPositionInPx = -this.currentSlideFirstIndexItem * this.itemWidth;
        return true;
      }
      return false;
    }

    moveSlide(): void {
      if (!this.areSliderLimits() && this.mouseDisplacementInDraggingInPx !== 0) {
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
    }
  }
</script>

<style lang="scss">
  .eco-carousel {
    &-slider {
      display: inline-flex;
      flex: 1 1 auto;
      align-items: flex-end;
      transition: transform 500ms ease-out;
      will-change: transform;

      &__item {
        flex: 1 0 auto;
      }

      &__dragging {
        transition: none;
      }
    }
  }
</style>
