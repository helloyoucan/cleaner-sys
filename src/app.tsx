let extraRoutes;
import { history } from 'umi';
// export function patchRoutes({ routes }) {
//   merge(routes, extraRoutes);
// }

// export function render(oldRender) {
//   fetch('/api/routes').then(res=>res.json()).then((res) => {
//     extraRoutes = res.routes;
//     oldRender();
//   })
// }
// export function render(oldRender) {
//   fetch('/api/auth').then(auth => {
//     if (auth.isLogin) { oldRender() }
//     else {
//       history.push('/login');
//       oldRender()
//     }
//   });
// }
export function onRouteChange({ matchedRoutes }) {
  if (matchedRoutes.length) {
    document.title = matchedRoutes[matchedRoutes.length - 1].route.title || '';
  }
}
