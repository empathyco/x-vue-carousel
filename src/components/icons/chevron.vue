<template functional>
  <svg
    :class="[].concat(data.staticClass, data.class)"
    class="eco-icon"
    height="1.3em"
    width="1.3em"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z" />
  </svg>
</template>

<style lang="scss">
  .eco-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .left-arrow-icon {
    transform: rotate(180deg);
  }
</style>
