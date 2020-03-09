<template>
  <div class="eco-carousel-pagination eco-carousel__pagination">
    <ul class="eco-carousel-pagination-container eco-carousel-pagination__container">
      <li
        v-for="(_, i) in slidesLength"
        :key="i"
        class="eco-carousel-pagination-container-dot eco-carousel-pagination-container__dot"
        :class="{ 'eco-carousel-pagination-container-dot__active': i === activeSlideIndex }"
      >
        <button
          @click="emitDisplaceSliderTo(i)"
          class="eco-carousel-pagination-container-dot-button eco-carousel-pagination-container-dot__button"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { EVENTS } from '@/utils/events.const';
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class Pagination extends Vue {
    @Prop({ required: true })
    slidesLength!: number;

    @Prop({ required: true })
    activeSlideIndex!: number;

    emitDisplaceSliderTo(slideIndexTo: number): void {
      // Event will be emitted to Carousel Component
      this.$parent.$emit(EVENTS.DisplaceSliderTo, slideIndexTo);
    }
  }
</script>

<style lang="scss">
  $default-color: #85abb3;
  $active-color: #32565e;

  .eco-carousel-pagination {
    text-align: center;

    &-container {
      list-style-type: none;
      padding: 0;
      margin: 0;

      &-dot {
        display: inline-block;

        &:not(:last-child) {
          margin-right: 12px;
        }

        &-button {
          height: 12px;
          width: 12px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background-color: $default-color;
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
          outline: none;
          cursor: pointer;
        }

        &__active .eco-carousel-pagination-container-dot__button {
          background-color: $active-color;
          cursor: default;
        }
      }
    }
  }
</style>
