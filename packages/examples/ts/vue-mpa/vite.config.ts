import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: '/index',
  },
  plugins: [
    {
      name: 'antd-css',
      apply: 'serve',
      transformIndexHtml(html) {
        // data可以传入模板中包含的一些变量
        return html.replace(
          '<head>',
          `<head>
          <link rel="stylesheet" href="/node_modules/antd/xxx">`,
        );
      },
    },
  ],
});
