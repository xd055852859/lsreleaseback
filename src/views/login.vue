<script setup lang="ts">
const login = () => {
  let redirect = encodeURIComponent(
    `${window.location.protocol}//${window.location.host}${window.location.pathname}#/space`
  );
  localStorage.clear();
  // `https://account.qingtime.cn?apphigh=50&redirect=&logo=https://workfly.qingtime.cn/1650849409262_workingVip.png`;
  let href: string = `https://account.qingtime.cn/?app=101&apphigh=55&logo=https://adminer.wananls.com/logo.svg&redirect=${redirect}`;
  window.open(href, "_self");
};
</script>
<template>
  <div
    class="login"
    :style="{
      backgroundImage: `url('/lsbackbg.png')`,
    }"
  >
    <div class="title-box">
      <!-- <img class="title-box-logo" src="/common/titleLogo.svg" alt="" /> -->

      <div class="title-box-title">资源发布后台管理系统</div>
      <div class="title-box-subtitle"></div>
      <div class="title-box-footer">
        <span
          className="title-box-ICPLicensing"
          @click="
            () => {
              //@ts-ignore
              window.open('http://beian.miit.gov.cn/');
            }
          "
        >
          Copyright © 2024 江苏脑际互联有限公司 .苏ICP备2022036554号-3
        </span>
      </div>
      <button class="btn-17 title-box-button" @click="login">
        <span class="text-container">
          <span class="text">登录</span>
        </span>
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  @include flex(center, center, null);

  .login-box {
    width: 420px;
    height: 580px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.11);
    padding-top: 44px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;

    .login-logo {
      width: 100%;
      height: 58px;
      margin-bottom: 45px;
      @include flex(center, center, null);

      img {
        width: 50%;
      }
    }

    .login-container {
      width: 100%;
      height: calc(100% - 140px);
      padding: 0px 34px;
      box-sizing: border-box;
      position: relative;
      z-index: 1;

      // .login-input {
      //   width: 100%;
      //   height: 45px;
      //   margin-bottom: 35px;
      //   border-radius: 4px;
      //   color: #999999;
      //   @include flex(space-between, center, null);
      // }

      .login-bottom-button {
        width: 100%;
        padding: 0px 34px;
        box-sizing: border-box;
        position: absolute;
        z-index: 2;
        left: 0px;
        bottom: 60px;

        .login-button {
          width: 100%;
          height: 48px;
          border-radius: 4px;
        }

        .login-prompt {
          width: 100%;
          height: 20px;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          line-height: 20px;
          margin-top: 15px;
          span {
            color: $commonColor;
          }
        }
      }
    }

    .login-bottom {
      width: 100%;
      height: 47px;
      border-radius: 0px 0px 12px 12px;
      line-height: 47px;
      font-size: 14px;
      color: #999999;
      text-align: center;
      position: absolute;
      z-index: 2;
      left: 0px;
      bottom: 0px;
    }
  }

  .title-box {
    width: 100vw;
    height: 100vh;
    align-content: center;
    @include flex(center, center, wrap);

    .title-box-logo {
      width: 44%;
      height: 22%;
      // margin-top: 319px;
      margin-bottom: 5%;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .title-box-title {
      width: 100%;
      height: 40px;
      font-size: 46px;
      font-weight: 600;
      color: #fff;
      line-height: 40px;
      margin-bottom: 14px;
      text-align: center;
    }

    .title-box-subtitle {
      width: 100%;
      height: 15px;
      font-size: 14px;
      font-family: Arial, Arial-Regular;
      font-weight: Regular;
      color: #b3b3b3;
      line-height: 15px;
      letter-spacing: 0.61px;
      text-align: center;
      margin-bottom: 3%;
    }
    .title-box-footer {
      width: 100%;
      height: 28px;
      line-height: 28px;
      position: fixed;
      left: 0px;
      bottom: 7%;
      text-align: center;
      .title-box-ICPLicensing {
        height: 28px;
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: Regular;
        color: #fff;
        line-height: 28px;
        letter-spacing: 0.86px;
        cursor: pointer;
      }
    }
    .title-box-button {
      // width: 13%;
      // height: 8%;
      position: fixed;
      z-index: 2;
      top: 8%;
      right: 5%;
      // border-radius: 44px;
      // font-size: 20px;
      // font-family: PingFang SC, PingFang SC-Medium;
      // font-weight: Medium;
      // text-align: center;
      // color: #ffffff;
      // line-height: 40px;
      // letter-spacing: 4.97px;
    }
  }
}
</style>
<style lang="scss">
.btn-17,
.btn-17 *,
.btn-17 :after,
.btn-17 :before,
.btn-17:after,
.btn-17:before {
  border: 0 solid;
  box-sizing: border-box;
}

.btn-17 {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  background-color: #000;
  background-image: none;
  color: #fff;
  cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  font-size: 100%;
  font-weight: 900;
  line-height: 1.5;
  margin: 0;
  -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
  padding: 0;
  text-transform: uppercase;
}

.btn-17:disabled {
  cursor: default;
}

.btn-17:-moz-focusring {
  outline: auto;
}

.btn-17 svg {
  display: block;
  vertical-align: middle;
}

.btn-17 [hidden] {
  display: none;
}

.btn-17 {
  border-radius: 99rem;
  border-width: 2px;
  padding: 0.8rem 3rem;
  z-index: 0;
}

.btn-17,
.btn-17 .text-container {
  overflow: hidden;
  position: relative;
}

.btn-17 .text-container {
  display: block;
  mix-blend-mode: difference;
}

.btn-17 .text {
  display: block;
  position: relative;
}

.btn-17:hover .text {
  -webkit-animation: move-up-alternate 0.3s forwards;
  animation: move-up-alternate 0.3s forwards;
}

@-webkit-keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes move-up-alternate {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(80%);
  }

  51% {
    transform: translateY(-80%);
  }

  to {
    transform: translateY(0);
  }
}

.btn-17:after,
.btn-17:before {
  --skew: 0.2;
  background: #fff;
  content: "";
  display: block;
  height: 102%;
  left: calc(-50% - 50% * var(--skew));
  pointer-events: none;
  position: absolute;
  top: -104%;
  transform: skew(calc(150deg * var(--skew))) translateY(var(--progress, 0));
  transition: transform 0.2s ease;
  width: 100%;
}

.btn-17:after {
  --progress: 0%;
  left: calc(50% + 50% * var(--skew));
  top: 102%;
  z-index: -1;
}

.btn-17:hover:before {
  --progress: 100%;
}

.btn-17:hover:after {
  --progress: -102%;
}
</style>
