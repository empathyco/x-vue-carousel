import Bus from '@/bus/bus';
import { EVENTS } from '@/utils/events.const';
import { SlideDirection } from '@/utils/slide-direction.enum';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export class MoveSlideMixin extends Vue {
  @Prop({ required: true })
  activeSlideIndex!: number;

  moveSlide(displacementDirection: SlideDirection): void {
    const slideIndexTo =
      displacementDirection === SlideDirection.RIGHT
        ? this.activeSlideIndex + 1
        : this.activeSlideIndex - 1;
    this.emitDisplaceSliderTo(slideIndexTo);
  }

  emitDisplaceSliderTo(slideIndexTo: number): void {
    Bus.$emit(EVENTS.DisplaceSliderTo, slideIndexTo);
  }
}
