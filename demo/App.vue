<template>
  <div class="app-demo">
    <Carousel v-bind="{ itemsPerSlide, itemMarginRightInPx, withArrows }">
      <Item v-for="item in items" :key="item.id" :item="item" />
    </Carousel>
    <Carousel v-bind="{ itemMarginRightInPx, withArrows }" :itemsPerSlide="4">
      <img
        src="https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/iv4shrrdg6ls6a8vo9ij/nikecourt-tennis-t-shirt-v1BtBt.jpg"
      />
      <img
        src="https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/wew3rrez4rfkaffl7pgj/aerolayer-running-jacket-Z02VhD.jpg"
      />
      <p>This a text</p>
      <p>This a text</p>
    </Carousel>
    <!--
    <Carousel
      v-bind="{ items, withArrows }"
      :itemsPerSlide="10"
      :itemMarginRightInPx="5"
      :withPagination="false"
      :slidingAnimationTimeInMs="1000"
      :navigationButtonIcon="arrowIconComponent"
    />
    <Carousel
      v-bind="{ items }"
      :itemsPerSlide="3"
      :itemMarginRightInPx="100"
      :withArrows="false"
      :slidingAnimationTimeInMs="200"
    />
    -->
  </div>
</template>

<script lang="ts">
  import Carousel from '@/components/carousel.vue';
  import Item from './components/item.vue';
  import { Item as ItemModel } from './models/item.model';
  import { Component, Vue } from 'vue-property-decorator';
  import { ItemsData } from './data/items-data';
  import { default as ArrowIcon } from './components/arrow.vue';

  @Component({
    components: { Carousel, Item }
  })
  export default class App extends Vue {
    windowWidth = window.innerWidth;

    // Need to be reactive to pass it as prop
    arrowIconComponent = ArrowIcon;

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
