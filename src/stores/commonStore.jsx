import { makeAutoObservable } from "mobx";

class CommonStore {
  token = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Метод для установки токена
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("jwt", token);
    } else {
      localStorage.removeItem("jwt");
    }
  }

  // Метод для загрузки токена из localStorage или проверки JSESSIONID в куки
  loadToken() {
    console.log("loadToken");
    const jsessionId = this.getCookie("JSESSIONID");
    if (jsessionId) {
      console.log("JSESSIONID cookie found:", jsessionId);
      this.token = jsessionId; 
      //localStorage.setItem("jwt", jsessionId);
    } else {
      this.token = localStorage.getItem("jwt");
      if (this.token) {
        console.log("Token loaded from localStorage:", this.token);
      } else {
        console.log("No token found in localStorage.");
      }
    }
  }

  // Вспомогательный метод для получения значения cookie по имени
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null; // Если cookie не найдено
  }
}

const commonStore = new CommonStore();
export default commonStore;


