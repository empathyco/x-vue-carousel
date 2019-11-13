<template>
  <Carousel :items="items"
            :itemsPerSlide="itemsPerSlide"
            :itemMarginRightInPx="15"
            :withPagination="true"
            :withArrows="true"
            :slidingAnimationTimeInMs="500"/>
</template>

<script lang="ts">
  import Carousel from '@/components/carousel.vue';
  import { ItemsData } from '@/items-data';
  import { Item as ItemModel } from '@/models/item.model';
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: { Carousel }
  })
  export default class App extends Vue {
    windowWidth = 0;

    mounted() {
      this.setWindowWidth();
      window.addEventListener('resize', () => this.setWindowWidth());
    }

    beforeDestroy() {
      window.removeEventListener('resize', () => this.setWindowWidth());
    }

    get items(): ItemModel[] {
      return ItemsData;
    }

    get itemsPerSlide(): number {
      return this.windowWidth > 600 ? 5 : 3;
    }

    setWindowWidth() {
      this.windowWidth = window.innerWidth;
    }
  }
</script>

<style lang="scss">

</style>
