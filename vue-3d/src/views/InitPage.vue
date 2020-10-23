<template>
  <div class="init">
    <div class="rabbit"></div>
    <div class="clouds"></div>
    <div class="moon"></div>
  </div>
</template>

<style lang="less" scoped>
.init {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(#110d3e, #000);
  position: relative;
  font-size: 20px;

  /* 月亮 */
  .moon {
    width: 100px;
    height: 100px;
    background: linear-gradient(to right bottom, yellow, #fff 75%);
    border-radius: 50%;
    position: absolute;
    top: 5%;
    right: 5%;
    box-shadow: 2px 2px 5px #f1f1c1;

    &::after {
      content: "";
      display: block;
      position: absolute;
      background-color: #100c3b;
      --n: 100%;
      width: var(--n);
      height: var(--n);
      border-radius: 50%;
      left: -20%;
      top: -15%;
    }
  }

  /* 兔子 */

  .rabbit {
    width: 5em;
    height: 3em;
    color: whitesmoke;
    background: radial-gradient(
        circle at 4.2em 1.4em,
        #333 0.15em,
        transparent 0.15em
      ),
      /* eye */ currentColor;
    border-radius: 70% 90% 60% 50%;
    position: relative;
    box-shadow: -0.2em 1em 0 -0.75em #333;
    z-index: 1;
    animation: hop 1s linear infinite;

    &::before,
    &::after {
      content: "";
      position: absolute;
    }

    // 耳朵
    &::before {
      width: 0.75em;
      height: 2em;
      background-color: currentColor;
      border-radius: 50% 100% 0 0;
      transform: rotate(-30deg);
      top: -1em;
      right: 1em;
      border: 0.1em solid;
      border-color: gainsboro transparent transparent gainsboro;
      box-shadow: -0.5em 0 0 -0.1em;
    }

    // 腿和尾巴
    &::after {
      width: 1em;
      height: 1em;
      background-color: currentColor;
      border-radius: 50%;
      left: -0.3em;
      top: 0.5em;
      box-shadow: 0.5em 2em 0, 4.2em 1.75em 0 -0.2em, 4.4em 1.9em 0 -0.2em;
      animation: kick 1s 0.4s infinite linear;
    }
  }

  /* 云 */
  .clouds {
    width: 2em;
    height: 2em;
    color: whitesmoke;
    background: currentColor;
    border-radius: 100% 100% 0 0;
    position: relative;
    top: -5em;
    animation: cloudy 1s infinite linear forwards;
    filter: opacity(0.75);
    &::before,
    &::after {
      content: "";
      position: absolute;
      background-color: currentColor;
      bottom: 0;
    }

    &::before {
      width: 1.25em;
      height: 1.25em;
      border-radius: 100% 100% 0 100%;
      left: -30%;
    }

    &::after {
      width: 1.5em;
      height: 1.5em;
      border-radius: 100% 100% 100% 0;
      right: -30%;
    }

    &,
    &::before,
    &::after {
      box-shadow: 5em 2em 0 -0.3em, -2em 2em 0 0;
    }
  }
}

/* 动画 */
@keyframes hop {
  20% {
    transform: rotate(-10deg) translate(1em, -2em);
    box-shadow: -0.2em 3em 0 -1em #333;
  }

  40% {
    transform: rotate(10deg) translate(3em, -4em);
    box-shadow: -0.2em 3.25em 0 -1.1em #333;
  }

  60%,
  75% {
    transform: rotate(0deg) translate(4em, 0);
    box-shadow: -0.2em 1em 0 -0.75em #333;
  }
}

@keyframes kick {
  60% {
    box-shadow: 0.5em 1em 0, 4em 1em 0 -0.2em, 4em 1em 0 -0.2em;
  }
}

@keyframes cloudy {
  40% {
    filter: opacity(0.75);
  }

  55%,
  100% {
    transform: translateX(-4em);
    filter: opacity(0);
  }
}
</style>