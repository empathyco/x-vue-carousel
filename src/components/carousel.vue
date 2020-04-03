<template>
  <div ref="carousel" class="eco-carousel">
    <Slider
      class="eco-carousel-slider eco-carousel__slider"
      v-bind="{
        itemsLength,
        activeSlideIndex,
        itemsPerSlide,
        itemMarginRightInPx,
        withArrows,
        slidingAnimationTimeInMs,
        minDraggingDisplacementInPx,
        navigationButtonIcon
      }"
    >
      <slot />
    </Slider>
    <Pagination
      v-if="withPagination"
      class="eco-carousel-pagination eco-carousel__pagination"
      v-bind="{ activeSlideIndex, slidesLength }"
    />
  </div>
</template>

<script lang="ts">
  import { default as ChevronIcon } from '@/components/icons/chevron.vue';
  import Pagination from '@/components/pagination.vue';
  import Slider from '@/components/slider.vue';
  import { EVENTS } from '@/utils/events.const';
  import Vue, { VueConstructor } from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component({
    components: { Slider, Pagination }
  })
  export default class Carousel extends Vue {
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

    @Prop({ default: 50 })
    minDraggingDisplacementInPx!: number;

    // Object & Arrays prop defaults must be returned from a function https://vuejs.org/v2/guide/components-props.html
    @Prop({ default: () => ChevronIcon })
    navigationButtonIcon!: VueConstructor;

    activeSlideIndex = 0;
    itemsLength!: number;

    windowWidth!: number;

    beforeCreate(): void {
      this.itemsLength = this.$slots.default?.length ?? 0;
    }

    mounted(): void {
      this.$on(EVENTS.DisplaceSliderTo, (slideIndexTo: number) => {
        this.activeSlideIndex = slideIndexTo;
      });
      window.addEventListener('resize', () => this.initCarousel());
      this.windowWidth = window.innerWidth;
    }

    beforeDestroy(): void {
      this.$off(EVENTS.DisplaceSliderTo);
      window.removeEventListener('resize', () => this.initCarousel());
    }

    protected get slidesLength(): number {
      return Math.ceil(this.itemsLength / this.itemsPerSlide);
    }

    initCarousel(): void {
      /* Chrome in mobile on scroll down hides the search box header and a resize event is fired.
       * To avoid this behaviour, the carousel just is initialized when the window width has been
       * resized */
      if (this.windowWidth !== window.innerWidth) {
        this.activeSlideIndex = 0;
        this.$emit(EVENTS.WindowWidthChanged);
        this.windowWidth = window.innerWidth;
      }
    }
  }
</script>

<style lang="scss">
  .eco-carousel {
    overflow: hidden;
  }
</style>
