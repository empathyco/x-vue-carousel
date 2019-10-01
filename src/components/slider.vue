<template>
  <section class="eco-carousel-slider eco-carousel__slider"
           ref="ecoCarouselSlider"
           :style="{ transform: `translate3d(${ displacementByAction }px, 0, 0)` }"
           @mousedown="startDrag($event)"
           @mouseup="stopDrag"
           @mousemove.prevent="calculateDragPosition($event)">
    <Item v-for="item in items"
          :key="item.id"
          :item="item"
          :style="{ flex: `1 0 ${ itemWidth }` }"></Item>
  </section>
</template>

<script lang="ts">
  import Item from '@/components/item.vue';
  import { Item as ItemModel } from '@/models/item.model';
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
    withArrows!: boolean;

    sliderWidth = 0;
    dragging = false;

    oldXposition = 0;
    lastXposition = 0;
    displacement = 0;
    currentPage = 0;

    mounted() {
      this.sliderWidth = (this.$refs.ecoCarouselSlider as Element).clientWidth;
    }

    get itemWidth() {
      return `${ this.sliderWidth / this.itemsPerSlide }px`;
    }

    get displacementByAction() {
      return this.dragging
        ? this.displacement
        : this.currentPage * this.sliderWidth;
    }

    startDrag(event: MouseEvent) {
      this.dragging = true;
      this.oldXposition = this.lastXposition = event.clientX;
    }

    stopDrag() {
      this.dragging = false;
      if (this.displacement > 0) {
        this.currentPage++;
        this.displacement = this.sliderWidth;
      } else {
        this.currentPage--;
        this.displacement = -this.sliderWidth;
      }
    }

    calculateDragPosition(event: MouseEvent) {
      if (this.dragging) {
        this.lastXposition = event.clientX;
        this.displacement = this.lastXposition - this.oldXposition;
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
      transition: 0s transform;
    }
  }
</style>
