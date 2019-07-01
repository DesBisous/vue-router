export default class RouterLink {
  router = null;

  constructor(router) {
    this.router = router;
  }

  getLink() {
    const _this = this;
    return {
      props: {
        to: String
      },
      render(h) {
        const tag = "a";
        const data = {};
        if (tag === "a") {
          data.attrs = {
            href: (_this.router.mode === "hash" ? "#" : "") + this.to
          };
          data.on = {
            click: [
              // 把 a 标签默认的行为 阻止掉
              _this.guardEvent,
              () => {
                _this.handler(this.to);
              }
            ]
          };
        }
        return h(tag, data, [this.$slots.default]);
      }
    };
  }

  handler(url) {
    this.router.push(url);
  }

  // 把 a 标签默认的行为 阻止掉
  guardEvent(e) {
    // don't redirect with control keys
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
    // don't redirect when preventDefault called
    if (e.defaultPrevented) return;
    // don't redirect on right click
    if (e.button !== undefined && e.button !== 0) return;
    // don't redirect if `target="_blank"`
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target)) return;
    }
    // this may be a Weex event which doesn't have this method
    if (e.preventDefault) {
      e.preventDefault();
    }
    return true;
  }
}
