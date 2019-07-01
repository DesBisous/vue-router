/* eslint-disable no-unused-vars */
export default class HTML5History {
  router = null;

  constructor(router) {
    this.router = router;
    // 监听一些游览器前进回退的一些操作
    window.addEventListener("popstate", e => this.onPopstate(e));
  }

  go(n) {
    window.history.go(n);
  }

  getPath() {
    return window.location.pathname;
  }

  onPopstate(e) {
    const path = this.getPath();
    const router = this.router.routeMap[path];
    const from = this.router.app.current;
    const to = path;
    if (router.beforeEnter) {
      // 有生命周期
      router.beforeEnter(from, to, () => {
        this.router.app.current = path;
      });
    } else {
      this.router.app.current = path;
    }
  }

  onInit(e = null) {
    this.onPopstate(e);
  }

  push(url) {
    // history 模式 使用pushState
    window.history.pushState({ key: Date.now() }, "", url);
    this.onPopstate();
  }

  replace(url) {
    // history 模式使用 window.location.replaceState
    window.history.replaceState({ key: Date.now() }, "", url);
    this.onPopstate();
  }
}
