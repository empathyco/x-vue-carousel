<template>
  <section class="eco-carousel-slider eco-carousel__slider"
           ref="ecoCarouselSlider"
           :class="{ 'eco-carousel-slider__dragging': dragging }"
           :style="{ transform: `translate3d(${ sliderPositionInPx }px, 0, 0)` }"
           @mousedown="startDrag($event)"
           @mouseup="stopDrag"
           @mousemove.prevent="drag($event)">
    <Item v-for="item in items"
          class="eco-carousel-slider__item"
          :key="item.id"
          :item="item"
          :style="{ width: itemWidth, 'margin-right': `${ itemMarginInPx }px` }"></Item>
  </section>
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
    itemMarginInPx!: number;

    @Prop({ required: true })
    withArrows!: boolean;

    slideWidth = 0;
    dragging = false;

    clickXPosition = 0;
    sliderPositionInPx = 0;
    currentDisplacementDirection!: SlideDirection;

    currentIndexSlide = 0;
    maxIndexSlide = 0;

    mounted() {
      this.slideWidth = (this.$refs.ecoCarouselSlider as Element).clientWidth;
      this.maxIndexSlide = Math.floor(this.items.length / this.itemsPerSlide);
    }

    get itemWidth() {
      return `${ (this.slideWidth / this.itemsPerSlide) - this.itemMarginInPx }px`;
    }

    startDrag(event: MouseEvent) {
      this.dragging = true;
      this.clickXPosition = event.clientX;
    }

    stopDrag() {
      this.dragging = false;
      this.limitCurrentIndexPageAvailable(this.currentDisplacementDirection);
    }

    drag(event: MouseEvent) {
      if (this.dragging) {
        const mouseDisplacementInDraggingInPx = event.clientX - this.clickXPosition;
        this.sliderPositionInPx = mouseDisplacementInDraggingInPx - (this.slideWidth * this.currentIndexSlide);
        this.currentDisplacementDirection = mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
      }
    }

    limitCurrentIndexPageAvailable(slideDirection: SlideDirection) {
      if (this.currentIndexSlide === 0 && slideDirection === SlideDirection.LEFT) {
        this.sliderPositionInPx = 0;
      } else if (this.currentIndexSlide === this.maxIndexSlide && slideDirection === SlideDirection.RIGHT) {
        this.sliderPositionInPx = -this.slideWidth * this.currentIndexSlide;
      } else {
        if (slideDirection === SlideDirection.LEFT) {
          this.currentIndexSlide--;
        } else if (slideDirection === SlideDirection.RIGHT) {
          this.currentIndexSlide++;
        }
        this.sliderPositionInPx = -this.slideWidth * this.currentIndexSlide;
      }
    }
  }
</script>

<style lang="scss">
  .eco-carousel {
    &-slider {
      display: flex;
      flex: 1 1 auto;
      align-items: flex-end;
      transition: transform 500ms ease-out;
      will-change: transform;

      &__item {
        flex: 1 0 auto;

        &:last-child {
          // margin-right: 0 !important;
        }
      }

      &__dragging {
        transition: none;
      }
    }
  }
</style>
