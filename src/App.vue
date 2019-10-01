<template>
  <Carousel :items="items"
            :itemsPerSlide="4"
            :withArrows="true"/>
</template>

<script lang="ts">
  import Carousel from '@/components/carousel.vue';
  import { Item as ItemModel } from '@/models/item.model';
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: { Carousel }
  })
  export default class App extends Vue {
    get items(): ItemModel[] {
      return [
        {
          id: '1',
          image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/iv4shrrdg6ls6a8vo9ij/nikecourt-tennis-t-shirt-v1BtBt.jpg',
          description: 'NikeCourt',
          price: '24.95€'
        },
        {
          id: '2',
          image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/s059e5bgpav59bllnwli/sb-icon-printed-pullover-skate-hoodie-9kFSZL.jpg',
          description: 'Nike SB Icon',
          price: '59.95€'
        },
        {
          id: '3',
          image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/zrhuv770kihyc9quujr5/sportswear-club-fleece-pullover-hoodie-q1JsNZ.jpg',
          description: 'Nike Sportwear Club Fleece',
          price: '£42.95'
        },
        {
          id: '4',
          image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/wew3rrez4rfkaffl7pgj/aerolayer-running-jacket-Z02VhD.jpg',
          description: 'Nike AeroLayer',
          price: '£89.95'
        },
        {
          id: '5',
          image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/meduqezz0yx1s375pawv/sportswear-n98-knit-warm-up-jacket-zqXWF4.jpg',
          description: 'Nike Sportswear N98',
          price: '54.95€'
        },
        {
          id: '6',
          image: 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/nfzn9yhfp1pakzlwefna/hurley-siege-anorak-jacket-7rVdGj.jpg',
          description: 'Hurley Siege Anorak',
          price: '£72.95'
        }
      ];
    }
  }
</script>

<style lang="scss">

</style>
