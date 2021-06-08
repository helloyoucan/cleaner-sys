const routes = [
  { exact: true, path: '/branch', component: 'branch/index', name: '网点' },
  { exact: true, path: '/coupon', component: 'coupon/index', name: '优惠券' },
  {
    exact: true,
    path: '/extraService',
    component: 'extraService/index',
    name: '附加服务',
  },
  { exact: true, path: '/', component: 'index/index', name: '首页' },
  { exact: true, path: '/order', component: 'order/index', name: '订单' },
  { exact: true, path: '/warrior', component: 'warrior/index', name: '战士' },
];
export default routes;
