/// <reference types="vite/client" />
// implicitly has an 'any' type 에러 방지
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
