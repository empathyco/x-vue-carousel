<template>
  <div class="app-demo">
    <!-- Vue client component as carousel items -->
    <div class="app-demo-container">
      <h2 class="app-demo-container-title">Vue client component as carousel items</h2>
      <Carousel v-bind="{ itemsPerSlide, itemMarginRightInPx, withArrows }">
        <Item v-for="item in items" :key="item.id" :item="item" />
      </Carousel>
      <section class="app-demo-container-code">
        <pre
          class="hljs"
          style="display: block; overflow-x: auto; padding: 0.5em; color: rgb(51, 51, 51); background: rgb(248, 248, 248);"
        ><span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Carousel</span> <span class="hljs-attr" style="color: teal;">v-bind</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"{ itemsPerSlide, itemMarginRightInPx, withArrows }"</span>&gt;</span>
  <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Item</span> <span class="hljs-attr" style="color: teal;">v-for</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"item in items"</span> <span class="hljs-attr" style="color: teal;">:key</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"item.id"</span> <span class="hljs-attr" style="color: teal;">:item</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"item"</span> /&gt;</span>
<span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">Carousel</span>&gt;</span></pre>
      </section>
    </div>
    <!-- Support to HTML anchor -->
    <div class="app-demo-container">
      <h2 class="app-demo-container-title">Support to HTML anchor</h2>
      <Carousel
        :itemsPerSlide="4"
        :itemMarginRightInPx="5"
        :withPagination="false"
        :slidingAnimationTimeInMs="1000"
        :minDraggingDisplacementInPx="20"
      >
        <article v-for="i in 15" :key="i">
          <a href="https://empathy.co">
            <img :src="`https://picsum.photos/id/1${i}/200/200`" alt="" style="width:100%" />
            <p style="text-align: center">Image footer</p>
          </a>
        </article>
      </Carousel>
      <section class="app-demo-container-code">
        <pre
          class="hljs"
          style="display: block; overflow-x: auto; padding: 0.5em; color: rgb(51, 51, 51); background: rgb(248, 248, 248);"
        ><span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Carousel</span>
   <span class="hljs-attr" style="color: teal;">:itemsPerSlide</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"4"</span>
   <span class="hljs-attr" style="color: teal;">:itemMarginRightInPx</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"5"</span>
   <span class="hljs-attr" style="color: teal;">:withPagination</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"false"</span>
   <span class="hljs-attr" style="color: teal;">:slidingAnimationTimeInMs</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"1000"</span>
   <span class="hljs-attr" style="color: teal;">:minDraggingDisplacementInPx</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"20"</span>
&gt;</span>
   <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">article</span> <span class="hljs-attr" style="color: teal;">v-for</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"i in 15"</span> <span class="hljs-attr" style="color: teal;">:key</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"i"</span>&gt;</span>
      <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">a</span> <span class="hljs-attr" style="color: teal;">href</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"https://empathy.co"</span>&gt;</span>
        <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">img</span> <span class="hljs-attr" style="color: teal;">:src</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"`https://picsum.photos/id/1${i}/200/200`"</span> <span class="hljs-attr" style="color: teal;">alt</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">""</span> <span class="hljs-attr" style="color: teal;">style</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"width:100%"</span> /&gt;</span>
        <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">p</span> <span class="hljs-attr" style="color: teal;">style</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"text-align: center"</span>&gt;</span>Image footer<span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">p</span>&gt;</span>
      <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">a</span>&gt;</span>
   <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">article</span>&gt;</span>
<span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">Carousel</span>&gt;</span></pre>
      </section>
    </div>
    <!-- HTML elements & Vue client components -->
    <div class="app-demo-container">
      <h2 class="app-demo-container-title">HTML elements & Vue client components</h2>
      <Carousel
        :itemsPerSlide="3"
        :itemMarginRightInPx="3"
        :withPagination="true"
        :withArrows="true"
        :slidingAnimationTimeInMs="100"
        :minDraggingDisplacementInPx="60"
        :navigationButtonIcon="arrowIconComponent"
      >
        <Item :item="items[3]" />
        <p class="app-demo-container-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <Item :item="items[6]" />
        <h3 class="app-demo-container-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </h3>
        <Item :item="items[12]" />
        <span class="app-demo-container-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </span>
        <Item :item="items[15]" />
        <h1 class="app-demo-container-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </h1>
      </Carousel>
      <section class="app-demo-container-code">
        <pre
          class="hljs"
          style="display: block; overflow-x: auto; padding: 0.5em; color: rgb(51, 51, 51); background: rgb(248, 248, 248);"
        ><span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Carousel</span>
   <span class="hljs-attr" style="color: teal;">:itemsPerSlide</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"3"</span>
   <span class="hljs-attr" style="color: teal;">:itemMarginRightInPx</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"3"</span>
   <span class="hljs-attr" style="color: teal;">:withPagination</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"true"</span>
   <span class="hljs-attr" style="color: teal;">:withArrows</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"false"</span>
   <span class="hljs-attr" style="color: teal;">:slidingAnimationTimeInMs</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"100"</span>
   <span class="hljs-attr" style="color: teal;">:minDraggingDisplacementInPx</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"60"</span>
   <span class="hljs-attr" style="color: teal;">:navigationButtonIcon</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"arrowIconComponent"</span>
&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Item</span> <span class="hljs-attr" style="color: teal;">:item</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"items[3]"</span> /&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">p</span> <span class="hljs-attr" style="color: teal;">class</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"app-demo-container-text"</span>&gt;</span>
       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
       ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
       ullamco laboris nisi ut aliquip ex ea commodo consequat.
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">p</span>&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Item</span> <span class="hljs-attr" style="color: teal;">:item</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"items[6]"</span> /&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">h3</span> <span class="hljs-attr" style="color: teal;">class</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"app-demo-container-text"</span>&gt;</span>
       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
       ut labore et dolore magna aliqua.
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">h3</span>&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Item</span> <span class="hljs-attr" style="color: teal;">:item</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"items[12]"</span> /&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">span</span> <span class="hljs-attr" style="color: teal;">class</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"app-demo-container-text"</span>&gt;</span>
       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
       ut labore et dolore magna aliqua.
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">span</span>&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">Item</span> <span class="hljs-attr" style="color: teal;">:item</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"items[15]"</span> /&gt;</span>
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;<span class="hljs-name" style="color: navy; font-weight: 400;">h1</span> <span class="hljs-attr" style="color: teal;">class</span>=<span class="hljs-string" style="color: rgb(221, 17, 68);">"app-demo-container-text"</span>&gt;</span>
       Lorem ipsum dolor sit amet, consectetur adipiscing elit
    <span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">h1</span>&gt;</span>
<span class="hljs-tag" style="color: navy; font-weight: 400;">&lt;/<span class="hljs-name" style="color: navy; font-weight: 400;">Carousel</span>&gt;</span></pre>
      </section>
    </div>
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

<style lang="scss">
  @import './src/styles/theme';

  .app-demo {
    &-container {
      width: 80%;
      margin: 0 auto 50px;
      border-top: 1px solid $pagination-default-color;
      border-bottom: 1px solid $pagination-default-color;

      &-title {
        text-align: center;
        padding: 0 20px;
      }

      &-code {
        margin-top: 30px;
        padding: 0 15px;

        pre {
          border-left: 3px solid $pagination-default-color;
        }
      }

      &-text {
        text-align: center;
        margin: auto 0;
      }
    }

    @media only screen and (max-width: 980px) {
      &-container {
        width: 100%;
        margin: 0 0 20px;
      }
    }
  }
</style>
