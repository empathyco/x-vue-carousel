import Bus from '@/bus/bus';
import { EVENTS } from '@/utils/events.const';
import { SlideDirection } from '@/utils/slide-direction.enum';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export class MoveSlideMixin extends Vue {
  moveSlide(displacementDirection: SlideDirection, currentSlideIndex: number): void {
    const slideIndexTo =
      displacementDirection === SlideDirection.RIGHT
        ? currentSlideIndex + 1
        : currentSlideIndex - 1;
    this.emitDisplaceSliderTo(slideIndexTo);
  }

  emitDisplaceSliderTo(slideIndexTo: number): void {
    Bus.$emit(EVENTS.DisplaceSliderTo, slideIndexTo);
  }
}
