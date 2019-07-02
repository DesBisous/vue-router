/* eslint-disable no-console */
import { supportsPushState } from "../util/push-state";
import HashHistory from "../history/hash";
import HTML5History from "../history/html5";
import RouterView from "../components/RouterView";
import RouterLink from "../components/RouterLink";

// 路由入口
let Vue;
class KRouter {
  $options = null; // 存储 路由 实例化时的数据
  routeMap = {}; // 存储路由对象映射
  fallback = false; // 判断是否支持 PushState，如果不支持则需要回退为 hash，默认为 false ，表示不需要回退，支持 PushState
  mode = "hash"; // 判断路由类型
  app = null; // 存储当前路由，词用一个 vue 实例属性来保存当前路由，目的是为了利用 vue 已做好的响应式机制，来触发 render 重新执行

  static install(_Vue) {
    // 别的地方要使用Vue
    Vue = _Vue;
    Vue.mixin({
      beforeCreate() {
        Vue.prototype.$title = "自写迷你 vue-router 简单实现版本";
        if (this.$options.router) {
          // 这是入口
          // 启动路由
          Vue.prototype.$bRouter = this.$options.router;

          this.$options.router.init();
          // 有时候路由需要动态跳转
          // this.$router.push('/about')
        }
      }
    });
  }

  constructor(options) {
    this.$options = options;
    this.routeMap = {};
    let mode = options.mode || "hash";
    // 判断在 history 的情况下，是否支持 pushState，不支持就回退为 hash
    this.fallback =
      mode === "history" && !supportsPushState && options.fallback !== false;
    if (this.fallback) {
      mode = "hash";
    }
    this.mode = mode;
    switch (mode) {
      case "hash":
        this.history = new HashHistory(this);
        break;
      case "history":
        this.history = new HTML5History(this);
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          console.error(false, `invalid mode: ${mode}`);
        }
    }
    // 使用Vue的响应式机制，路由切换的时候，做一些响应
    this.app = new Vue({
      data: {
        // 默认根目录
        current: "/"
      }
    });
  }

  init() {
    // 启动整个路由
    // 由插件use负责启动就可以了
    // 1. 处理路由表
    this.createRouteMap();
    // 2. 监听事件
    const history = this.history;
    if (history instanceof HashHistory) {
      history.bindEvents();
    } else {
      history.onInit();
    }
    // 3. 初始化组件 router-view 和router-link
    this.initComponent();
  }

  initComponent() {
    // router-view
    Vue.component("router-view", new RouterView(this).getView());
    // router-link
    Vue.component("router-link", new RouterLink(this).getLink());
  }

  createRouteMap() {
    this.$options.routes.forEach(item => {
      this.routeMap[item.path] = item;
    });
  }

  push(url) {
    this.history.push(url);
  }
  replace(url) {
    this.history.replace(url);
  }
  go(n) {
    this.history.go(n);
  }

  back() {
    this.go(-1);
  }

  forward() {
    this.go(1);
  }
}

export default KRouter;
