import { routeURL } from './site/localLibrary.js';
/** 栏目不进地址；地图、回放、存档和草稿使用同一个主页入口。 */
export function mapURL(code,{replay,save,draft}={}) { return routeURL({map:code,replay,save,draft}); }
