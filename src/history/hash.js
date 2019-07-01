export default class HashHistory {
  router = null;

  constructor(router) {
    this.router = router;
  }

  go(n) {
    window.history.go(n);
  }

  bindEvents() {
    window.addEventListener("hashchange", this.onHashChange.bind(this), false);
    window.addEventListener("load", this.onHashChange.bind(this), false);
  }

  getHash() {
    return window.location.hash.slice(1) || "/";
  }

  getFrom(e) {
    let from, to;
    if (e.newURL) {
      // 这是一个hashchange
      from = e.oldURL.split("#")[1];
      to = e.newURL.split("#")[1];
    } else {
      // 这是一个第一次加载触发的
      from = "";
      to = this.getHash();
    }
    return { from, to };
  }

  onHashChange(e) {
    // 路由跳转马上开始
    // console.log('路由准备跳转')
    // 获取当前的哈希值
    const hash = this.getHash();
    const router = this.router.routeMap[hash];
    const { from, to } = this.getFrom(e);
    // 修改this.router.app.current 借用了vue的响应式机制
    // console.log('hash变了')
    if (router.beforeEnter) {
      // 有生命周期
      router.beforeEnter(from, to, () => {
        this.router.app.current = hash;
      });
    } else {
      this.router.app.current = hash;
    }
  }

  push(url) {
    // hash模式直接复制
    window.location.hash = url;
  }

  replace(url) {
    // hash 模式使用 window.location.replace
    const i = window.location.href.indexOf("#");
    window.location.replace(
      window.location.href.slice(0, i >= 0 ? i : 0) + "#" + url
    );
  }
}
