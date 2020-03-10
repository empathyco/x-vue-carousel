<template>
  <div class="eco-carousel">
    <Slider
      class="eco-carousel-slider eco-carousel__slider"
      :items="items"
      :itemsPerSlide="itemsPerSlide"
      :itemMarginRightInPx="itemMarginRightInPx"
      :withArrows="withArrows"
      :slidingAnimationTimeInMs="slidingAnimationTimeInMs"
      :minDraggingDisplacement="minDraggingDisplacement"
      :activeSlideIndex="activeSlideIndex"
    />
    <Pagination
      v-if="withPagination"
      class="eco-carousel-pagination eco-carousel__pagination"
      :slidesLength="slidesLength"
      :activeSlideIndex="activeSlideIndex"
    />
  </div>
</template>

<script lang="ts">
  import Bus from '@/bus/bus';
  import Pagination from '@/components/pagination.vue';
  import Slider from '@/components/slider.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { EVENTS } from '@/utils/events.const';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component({
    components: { Slider, Pagination }
  })
  export default class Carousel extends Vue {
    @Prop({ required: true })
    items!: ItemModel[];

    @Prop({ default: 4 })
    itemsPerSlide!: number;

    @Prop({ default: 20 })
    itemMarginRightInPx!: number;

    @Prop({ default: true })
    withPagination!: boolean;

    @Prop({ default: true })
    withArrows!: boolean;

    @Prop({ default: 500 })
    slidingAnimationTimeInMs!: number;

    @Prop({ default: 150 })
    minDraggingDisplacement!: number;

    activeSlideIndex = 0;

    mounted(): void {
      Bus.$on(EVENTS.DisplaceSliderTo, (slideIndexTo: number) => {
        this.activeSlideIndex = slideIndexTo;
      });
      window.addEventListener('resize', () => this.initCarousel());
    }

    beforeDestroy(): void {
      window.removeEventListener('resize', () => this.initCarousel());
    }

    protected get slidesLength(): number {
      return Math.ceil(this.items.length / this.itemsPerSlide);
    }

    initCarousel(): void {
      this.activeSlideIndex = 0;
    }
  }
</script>

<style lang="scss">
  .eco-carousel {
    overflow: hidden;
  }
</style>
