export type AppPage =
  | 'home'
  | 'tai-xe'
  | 'gui-hang'
  | 'nhan-hang'
  | 'kho-hub'
  | 'admin'
  | 'ca-nhan'
  | 'tracking'
  | 'chat'
  | 'dang-ky';

class NavigationService {
  private navigateHandler:
    | ((page: AppPage) => void)
    | null = null;

  /**
   * Đăng ký navigate function từ React
   */
  registerNavigate(
    handler: (page: AppPage) => void
  ) {
    this.navigateHandler = handler;
  }

  /**
   * Navigate tổng quát
   */
  navigate(page: AppPage) {
    if (!this.navigateHandler) {
      console.warn(
        '[NavigationService] navigateHandler chưa được đăng ký'
      );

      return;
    }

    this.navigateHandler(page);
  }

  /* =========================
     SHORTCUT METHODS
  ========================= */

  goHome() {
    this.navigate('home');
  }

  goDriver() {
    this.navigate('tai-xe');
  }

  goSender() {
    this.navigate('gui-hang');
  }

  goReceiver() {
    this.navigate('nhan-hang');
  }

  goWarehouse() {
    this.navigate('kho-hub');
  }

  goAdmin() {
    this.navigate('admin');
  }

  goProfile() {
    this.navigate('ca-nhan');
  }

  goTracking() {
    this.navigate('tracking');
  }

  goChat() {
    this.navigate('chat');
  }

  goRegister() {
    this.navigate('dang-ky');
  }
}

export const navigationService =
  new NavigationService();