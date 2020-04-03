<template>
  <article class="client-item">
    <img class="client-item__image" :src="item.image" :alt="item.description" />
    <p class="client-item__description">{{ item.description }}</p>
    <p class="client-item__price">{{ item.price }}</p>
  </article>
</template>

<script lang="ts">
  import { Item as ItemModel } from '../models/item.model';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class Item extends Vue {
    @Prop({ required: true })
    item!: ItemModel;
  }
</script>

<style lang="scss">
  .client-item {
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
