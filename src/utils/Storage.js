class Storage {
  // getItem
  getLocalRefreshToken() {
    return localStorage.getItem("refreshToken");
  }
  getLocalAccessToken() {
    return localStorage.getItem("accessToken");
  }
  getLocalAppToken() {
    return localStorage.getItem("appToken");
  }
  getLocalUserId() {
    return localStorage.getItem("userId");
  }
  getLocalListService() {
    const listServices = localStorage.getItem("listService");
    return JSON.parse(listServices);
  }
  getLocalMode() {
    let mode = localStorage.getItem("mode");
    if (mode === null) {
      mode = "light";
      this.updateLocalMode(mode);
    }
    return mode;
  }
  getLocalSelectedMenuItem() {
    return localStorage.getItem("selectedMenu");
  }

  // setItem
  updateLocalMode(mode) {
    localStorage.setItem("mode", mode);
  }
  updateLocalAccessToken(accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  updateLocalRefreshToken(refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
  updateLocalAppToken(appToken) {
    localStorage.setItem("appToken", appToken);
  }
  updateLocalUserId(userId) {
    localStorage.setItem("userId", userId);
  }
  updateLocalListService(listServices) {
    localStorage.setItem("listService", JSON.stringify(listServices));
  }
  updateLocalSelectedMenuItem(selectedMenu) {
    localStorage.setItem("selectedMenu", selectedMenu);
  }

  removeAccessToken() {
    localStorage.removeItem("accessToken");
  }
  // clear local storage & session storage
  clearLocal() {
    sessionStorage.clear();
    localStorage.clear();
  }
}

export default new Storage();
