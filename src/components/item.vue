<template>
  <article class="eco-carousel-item eco-carousel__item">
    <img class="eco-carousel-item__image" :src="item.image" :alt="item.description" />
    <p class="eco-carousel-item__description">{{ item.description }}</p>
    <p class="eco-carousel-item__price">{{ item.price }}</p>
  </article>
</template>

<script lang="ts">
  import { Item as ItemModel } from '@/models/item.model';
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Item extends Vue {
    @Prop({ required: true })
    item!: ItemModel;
  }
</script>

<style lang="scss">
  .eco-carousel-item {
    text-align: center;

    &__image {
      width: 100%;
    }

    &__description,
    &__price {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
