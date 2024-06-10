<script setup>
import IconGenerating from '~icons/base/Generating'
</script>

<template>
  <div class="screen-generating">
    <IconGenerating />
  </div>
</template>
<style scoped>
.screen-generating {
  height: 140px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid green; */
  overflow: hidden;
  position: relative;

  svg {
    transform: scale(1);
  }

  svg * {
    transform-box: fill-box;
  }

  :deep(path) {
    animation-name: gen1;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
    animation-timing-function: ease-in-out;
    transform-origin: center center;

    :nth-child(1) {
      animation-delay: -1s;
    }
  }
  :deep(path:nth-child(4n + 1)) {
    animation-delay: -0.5s;
  }
  :deep(path:nth-child(4n + 2)) {
    animation-delay: -1s;
  }
  :deep(path:nth-child(4n + 3)) {
    animation-delay: -1.5s;
  }
}

/* .screen-generating:deep(path) {
  animation-name: gen1;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
} */
</style>
<style>
@keyframes gen1 {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
