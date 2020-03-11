import Bus from '@/bus/bus';
import { EVENTS } from '@/utils/events.const';
import { SlideDirection } from '@/utils/slide-direction.enum';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export class MoveSlideMixin extends Vue {
  moveSlide(displacementDirection: SlideDirection): void {
    // Every component which uses this mixin should have the activeSlideIndex prop
    const activeSlideIndex: number = (this as any).activeSlideIndex;
    const slideIndexTo =
      displacementDirection === SlideDirection.RIGHT ? activeSlideIndex + 1 : activeSlideIndex - 1;
    this.emitDisplaceSliderTo(slideIndexTo);
  }

  emitDisplaceSliderTo(slideIndexTo: number): void {
    Bus.$emit(EVENTS.DisplaceSliderTo, slideIndexTo);
  }
}
