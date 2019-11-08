<template>
  <Carousel :items="items"
            :itemsPerSlide="5"
            :itemMarginInPx="20"
            :withArrows="true"/>
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
    get items(): ItemModel[] {
      return ItemsData;
    }
  }
</script>

<style lang="scss">

</style>
