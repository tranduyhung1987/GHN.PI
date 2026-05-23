import { PAGE_REGISTRY } from "./pageRegistry";

let navigateFn: any = null;

export const navigationService = {
  setNavigator(navigate: any) {
    navigateFn = navigate;
  },

  go(path: string) {
    navigateFn?.(path);
  },

  goLogin() {
    navigateFn?.(PAGE_REGISTRY.LOGIN.path);
  },

  goHome() {
    navigateFn?.(PAGE_REGISTRY.HOME.path);
  },

  guardGo(pageKey: keyof typeof PAGE_REGISTRY, role: string) {
    const page = PAGE_REGISTRY[pageKey];

    if (!page.roles.includes(role as any)) {
      navigateFn?.(PAGE_REGISTRY.HOME.path);
      return;
    }

    navigateFn?.(page.path);
  },
};