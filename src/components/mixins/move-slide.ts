import { EmitToCarouselMixin } from '@/components/mixins/emit-to-carousel';
import { SlideDirection } from '@/utils/slide-direction.enum';
import { Component, Mixins, Prop } from 'vue-property-decorator';

@Component
export class MoveSlideMixin extends Mixins(EmitToCarouselMixin) {
  @Prop({ required: true })
  activeSlideIndex!: number;

  moveSlide(displacementDirection: SlideDirection): void {
    const slideIndexTo =
      displacementDirection === SlideDirection.RIGHT
        ? this.activeSlideIndex + 1
        : this.activeSlideIndex - 1;
    this.emitDisplaceSlider(slideIndexTo);
  }
}
