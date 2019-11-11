<template>
  <div class="eco-carousel eco__carousel">
    <Slider :items="items"
            :itemsPerSlide="itemsPerSlide"
            :itemMarginRightInPx="itemMarginRightInPx"
            :withArrows="withArrows"/>
    <Pagination v-if="withPagination"/>
  </div>
</template>

<script lang="ts">
  import Pagination from '@/components/pagination.vue';
  import Slider from '@/components/slider.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({
    components: { Slider, Pagination }
  })
  export default class Carousel extends Vue {
    @Prop({ required: true })
    items!: ItemModel[];

    @Prop({ default: 4 })
    itemsPerSlide!: number;

    @Prop({ default: 20 })
    itemMarginRightInPx!: number;

    @Prop({ default: true })
    withPagination!: boolean;

    @Prop({ default: true })
    withArrows!: boolean;
  }
</script>

<style lang="scss">
  .eco-carousel {
    overflow: hidden;
  }
</style>
