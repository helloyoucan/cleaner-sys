import { defineConfig } from 'umi';
import routes from './routes';
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
      target: 'http://192.168.20.93:8080',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
});
