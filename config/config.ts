import { defineConfig } from 'umi';
import routes from './routes';
const Key = 'PSLBZ-Y6GWU-SQOVF-BPOJK-IESTV-TSBZV';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: {
    name: 'Ant Design',
    fixSiderbar: true,
    navTheme: 'dark',
    primaryColor: '#1890ff',
    layout: 'side',
    contentWidth: 'Fluid',
    splitMenus: false,
    fixedHeader: true,
    footerRender: false,
  },
  routes,
  fastRefresh: {},
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
  headScripts: [
    `https://map.qq.com/api/js?v=2.exp&key=${Key}&libraries=drawing,place`,
  ],
});
