<template>
  <div class="eco-pagination">
    <ul class="eco-pagination-container eco-pagination__container">
      <li
        v-for="(_, i) in slidesLength"
        :key="i"
        class="eco-pagination-container-dot eco-pagination-container__dot"
        :class="{ 'eco-pagination-container-dot--active': i === activeSlideIndex }"
      >
        <button @click="emitDisplaceSliderTo(i)" class="eco-pagination-container-dot__button" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import Bus from '@/bus/bus';
  import { EVENTS } from '@/utils/events.const';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class Pagination extends Vue {
    @Prop({ required: true })
    slidesLength!: number;

    @Prop({ required: true })
    activeSlideIndex!: number;

    emitDisplaceSliderTo(slideIndexTo: number): void {
      Bus.$emit(EVENTS.DisplaceSliderTo, slideIndexTo);
    }
  }
</script>

<style lang="scss">
  @import './src/styles/theme';

  .eco-pagination {
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
