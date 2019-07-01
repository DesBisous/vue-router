export default class RouterView {
  router = null;

  constructor(router) {
    this.router = router;
  }

  getView() {
    return {
      render: h => {
        const component = this.router.routeMap[this.router.app.current]
          .component;
        // 使用h新建一个虚拟dom
        return h(component);
      }
    };
  }
}
