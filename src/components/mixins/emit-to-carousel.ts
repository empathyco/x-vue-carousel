import { EVENTS } from '@/utils/events.const';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

const CAROUSEL_COMPONENT_REF = 'carousel';

@Component
export class EmitToCarouselMixin extends Vue {
  carouselComponent: Vue | undefined;

  mounted(): void {
    this.carouselComponent = this.$parent;
    // Search Carousel component by ref
    while (this.carouselComponent.$refs[CAROUSEL_COMPONENT_REF] === undefined) {
      this.carouselComponent = this.carouselComponent.$parent;
    }
  }

  emitDisplaceSlider(slideIndexTo: number): void {
    this.carouselComponent?.$emit(EVENTS.DisplaceSliderTo, slideIndexTo);
  }
}
