import NProgress from "nprogress";

export function onProgressStart() {
  NProgress.start();
}

export function onProgressComplete() {
  NProgress.done();
}
