import { MoveSlideMixin } from '@/components/mixins/move-slide';
import { SlideDirection } from '@/utils/slide-direction.enum';
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

const TIME_BETWEEN_SCROLL_EVENTS_IN_MS = 50;
const Y_MOVEMENT_MARGIN_IN_PX = 20;

@Component
export class SlidingMixin extends Mixins(MoveSlideMixin) {
  @Prop({ required: true })
  itemsLength!: number;

  @Prop({ required: true })
  itemsPerSlide!: number;

  @Prop({ required: true })
  minDraggingDisplacementInPx!: number;

  @Prop({ required: true })
  slidingAnimationTimeInMs!: number;

  sliderViewportWidth = 0; // Width per slide. Slider viewport width
  isAnimatingSliderToRestore = false; // Current slide is retrieving to its original position

  isStartingDragging = false; // The slide is dragging
  clickXPosition = 0; // Click X position of the mouse or touch
  clickYPosition = 0; // Click Y position of the mouse or touch (to prevent dragging)
  mouseDisplacementInDraggingInPx = 0; // Mouse displacement in dragging regarding X position click
  thereWasMouseDisplacementInDragging = false; // There was mouse displacement in the last dragging interaction

  baseSliderPositionInPx = 0; // Slider position in pixels (number of slides in pixels)
  currentSliderPositionInPx = 0; // Current position in pixels (depends on the mouse displacement)
  currentDisplacementDirection = SlideDirection.LEFT; // Displacement direction

  firstIndexItemCurrentSlide = 0; // Index of the first item of current slide in the viewport of the slider
  maxFirstIndexItem = 0; // Index of the first item of the last slide of the slider

  timeBetweenScrollEventsInMs = 0; // Time between scroll events to apply a new one

  @Watch('itemsPerSlide', { immediate: false })
  onItemsPerSlideChange(): void {
    this.initSlider();
  }

  @Watch('activeSlideIndex', { immediate: false })
  onActiveSlideIndexChange(newActiveSlideIndex: number, oldActiveSlideIndex: number): void {
    this.currentDisplacementDirection =
      newActiveSlideIndex < oldActiveSlideIndex ? SlideDirection.LEFT : SlideDirection.RIGHT;

    this.firstIndexItemCurrentSlide =
      newActiveSlideIndex === Math.floor(this.itemsLength / this.itemsPerSlide)
        ? this.maxFirstIndexItem
        : newActiveSlideIndex * this.itemsPerSlide;

    this.setCurrentSliderPosition();
  }

  protected get itemWidth(): number {
    return this.sliderViewportWidth / this.itemsPerSlide;
  }

  protected get isFirstSlide(): boolean {
    return this.firstIndexItemCurrentSlide === 0;
  }

  protected get isLastSlide(): boolean {
    return this.firstIndexItemCurrentSlide === this.maxFirstIndexItem;
  }

  initSlider(): void {
    const lengthAndPerSlideDiff = this.itemsLength - this.itemsPerSlide;
    this.maxFirstIndexItem = lengthAndPerSlideDiff >= 0 ? lengthAndPerSlideDiff : 0;

    this.currentSliderPositionInPx = 0;
    this.firstIndexItemCurrentSlide = 0;
    this.baseSliderPositionInPx = 0;

    this.timeBetweenScrollEventsInMs = new Date().getTime();
  }

  addSlidingEventListeners(): void {
    window.addEventListener('mouseup', () => this.stopDrag());
    window.addEventListener('mousemove', (event: MouseEvent) => this.drag(event));

    window.addEventListener('touchend', () => this.stopDrag());
    window.addEventListener('touchmove', (event: TouchEvent) =>
      this.preventDraggingInYMovement(event)
    );
  }

  removeSlidingEventListeners(): void {
    window.removeEventListener('mouseup', () => this.stopDrag());
    window.removeEventListener('mousemove', (event: MouseEvent) => this.drag(event));

    window.removeEventListener('touchend', () => this.stopDrag());
    window.removeEventListener('touchmove', (event: TouchEvent) =>
      this.preventDraggingInYMovement(event)
    );
  }

  setCurrentSliderPosition(): void {
    this.currentSliderPositionInPx = -this.firstIndexItemCurrentSlide * this.itemWidth;
    this.baseSliderPositionInPx = this.currentSliderPositionInPx;
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    this.isStartingDragging = true;
    this.clickXPosition = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    this.clickYPosition = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  }

  preventDraggingInYMovement(event: TouchEvent): void {
    const currentYPos = event.touches[0].clientY;
    if (Math.abs(this.clickYPosition - currentYPos) > Y_MOVEMENT_MARGIN_IN_PX) {
      this.stopDrag();
    } else {
      this.drag(event);
    }
  }

  drag(event: MouseEvent | TouchEvent): void {
    if (this.isStartingDragging) {
      const currentXPos = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      this.mouseDisplacementInDraggingInPx = currentXPos - this.clickXPosition;
      this.currentSliderPositionInPx =
        this.mouseDisplacementInDraggingInPx + this.baseSliderPositionInPx;
    }
  }

  stopDrag(): void {
    if (this.isStartingDragging) {
      const displacementDirection =
        this.mouseDisplacementInDraggingInPx > 0 ? SlideDirection.LEFT : SlideDirection.RIGHT;
      if (this.isMouseDisplacementGreaterThanMin() && !this.isSliderLimit(displacementDirection)) {
        this.moveSlide(displacementDirection);
      } else {
        this.setSliderAnimationToRestoreSlide();
        this.setCurrentSliderPosition();
      }
      this.thereWasMouseDisplacementInDragging = this.mouseDisplacementInDraggingInPx !== 0;
      this.mouseDisplacementInDraggingInPx = 0;
    }
    this.isStartingDragging = false;
  }

  scroll(event: WheelEvent): void {
    this.preventXMovement(event);
    const timeNow = new Date().getTime();
    if (timeNow - this.timeBetweenScrollEventsInMs > TIME_BETWEEN_SCROLL_EVENTS_IN_MS) {
      if (event.deltaX > 0) {
        this.currentSliderPositionInPx = -this.itemWidth + this.baseSliderPositionInPx;
        this.moveSlideOnScrollAnimation(SlideDirection.RIGHT);
      } else if (event.deltaX < 0) {
        this.currentSliderPositionInPx = this.itemWidth + this.baseSliderPositionInPx;
        this.moveSlideOnScrollAnimation(SlideDirection.LEFT);
      }
    }
    this.timeBetweenScrollEventsInMs = timeNow;
  }

  moveSlideOnScrollAnimation(displacementDirection: SlideDirection): void {
    if (this.isSliderLimit(displacementDirection)) {
      this.setSliderAnimationToRestoreSlide(() => this.setCurrentSliderPosition());
    } else {
      this.moveSlide(displacementDirection);
    }
  }

  isMouseDisplacementGreaterThanMin(): boolean {
    return Math.abs(this.mouseDisplacementInDraggingInPx) > this.minDraggingDisplacementInPx;
  }

  isSliderLimit(displacementDirection: SlideDirection): boolean {
    const isLeftSliderLimit: boolean =
      this.isFirstSlide && displacementDirection === SlideDirection.LEFT;
    const isRightSliderLimit: boolean =
      this.isLastSlide && displacementDirection === SlideDirection.RIGHT;

    return isLeftSliderLimit || isRightSliderLimit;
  }

  setSliderAnimationToRestoreSlide(callback?: () => void): void {
    this.isAnimatingSliderToRestore = true;
    setTimeout(() => {
      callback?.();
      this.isAnimatingSliderToRestore = false;
    }, this.slidingAnimationTimeInMs / 2);
  }

  preventClick(event: MouseEvent): void {
    if (this.thereWasMouseDisplacementInDragging) {
      event.preventDefault();
    }
  }

  preventXMovement(event: WheelEvent): void {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
    }
  }
}
