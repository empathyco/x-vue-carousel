<template>
  <Carousel v-bind="{ items, itemsPerSlide, itemMarginRightInPx, withArrows }" />
</template>

<script lang="ts">
  import Carousel from '@/components/carousel.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { Component, Vue } from 'vue-property-decorator';
  import { ItemsData } from './items-data';

  @Component({
    components: { Carousel }
  })
  export default class App extends Vue {
    windowWidth = window.innerWidth;

    mounted(): void {
      window.addEventListener('resize', () => this.setWindowWidth());
    }

    beforeDestroy(): void {
      window.removeEventListener('resize', () => this.setWindowWidth());
    }

    protected get items(): ItemModel[] {
      return ItemsData;
    }

    protected get itemsPerSlide(): number {
      if (this.windowWidth >= 1600) {
        return 7;
      }
      if (this.windowWidth < 1600 && this.windowWidth >= 980) {
        return 5;
      }
      if (this.windowWidth < 980 && this.windowWidth >= 600) {
        return 3;
      }
      return 2;
    }

    protected get itemMarginRightInPx(): number {
      return this.windowWidth >= 980 ? 20 : 10;
    }

    protected get withArrows(): boolean {
      return this.windowWidth >= 980;
    }

    setWindowWidth(): void {
      this.windowWidth = window.innerWidth;
    }
  }
</script>
