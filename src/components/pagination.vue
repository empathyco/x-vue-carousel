<template>
  <div class="eco-pagination">
    <ul class="eco-pagination-container eco-pagination__container">
      <li
        v-for="(_, i) in slidesLength"
        :key="i"
        class="eco-pagination-container-dot eco-pagination-container__dot"
        :class="{ 'eco-pagination-container-dot--active': i === activeSlideIndex }"
      >
        <button @click="emitDisplaceSlider(i)" class="eco-pagination-container-dot__button" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { EmitToCarouselMixin } from '@/components/mixins/emit-to-carousel';
  import { Component, Mixins, Prop } from 'vue-property-decorator';

  @Component
  export default class Pagination extends Mixins(EmitToCarouselMixin) {
    @Prop({ required: true })
    slidesLength!: number;

    @Prop({ required: true })
    activeSlideIndex!: number;
  }
</script>

<style lang="scss">
  @import './src/styles/theme';

  .eco-pagination {
    text-align: center;
    margin-top: 10px;

    &-container {
      list-style-type: none;
      padding: 0;
      margin: 0;

      &-dot {
        display: inline-block;

        &:not(:last-child) {
          margin-right: 12px;
        }

        &__button {
          height: 12px;
          width: 12px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background-color: $pagination-default-color;
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
          outline: none;
          cursor: pointer;
        }

        &--active .eco-pagination-container-dot__button {
          background-color: $pagination-active-color;
          cursor: default;
        }
      }
    }
  }
</style>
