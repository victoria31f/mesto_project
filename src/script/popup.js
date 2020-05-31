export default class Popup {
  constructor(content, popupClass) {
    this.popup = document.querySelector('.popup');
    this.content = content;
    this.popupClass = popupClass;
    this.container = this.popup.querySelector('#popup-content');
  }


  open() {
    this.container.insertAdjacentHTML('beforeend', this.content);
    this.container.classList.add(this.popupClass);
    this.popup.classList.add('popup_is-opened');
    this.popup.addEventListener('click', this.close);
  }

  closeActions() {
    this.container.removeChild(this.container.lastElementChild);
    this.container.classList.remove(this.popupClass);
    this.popup.classList.remove("popup_is-opened");
    this.popup.removeEventListener('click', this.close);

  }

  close = (event) => {
    if (!(event.target.classList.contains('field-not-clickable'))) {
      this.closeActions();
    }
  }

}


