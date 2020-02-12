<template>
  <Carousel
    :items="items"
    :itemsPerSlide="itemsPerSlide"
    :itemMarginRightInPx="itemMarginRightInPx"
    :withPagination="true"
    :withArrows="withArrows"
    :slidingAnimationTimeInMs="500"
  />
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

    mounted() {
      window.addEventListener('resize', () => this.setWindowWidth());
    }

    beforeDestroy() {
      window.removeEventListener('resize', () => this.setWindowWidth());
    }

    get items(): ItemModel[] {
      return ItemsData;
    }

    get itemsPerSlide(): number {
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

    get itemMarginRightInPx(): number {
      return this.windowWidth >= 980 ? 20 : 10;
    }

    get withArrows(): boolean {
      return this.windowWidth >= 980;
    }

    setWindowWidth() {
      this.windowWidth = window.innerWidth;
    }
  }
</script>

<style lang="scss"></style>
