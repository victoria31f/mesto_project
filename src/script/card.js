/*Это класс, создающий карточку. Добавьте ему методы constructor, like и remove. И ещё один — create. Он будет создавать DOM-элемент карточки.*/
export  default class Card {
  constructor(name, link, likes, zoomPopup, deleteCardFunc) {
    this.name = name;
    this.link = link;
    this.likes = likes;
    this.zoom = zoomPopup;
    this.deleteCard = deleteCardFunc;
    this._element = document.createElement('div');
  }

  like(event) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }

  remove = () => {
    if (window.confirm('Вы действительно хотите удалить эту карточку?')) {
      // this.removeEventListeners();
      // this._element.remove();
      this.deleteCard(this._element.id)
        .then(() => {
          this.removeEventListeners();
          this._element.remove();    
        })  
    }
  }

  create() {
    this._element.classList.add("place-card");
    this._element.insertAdjacentHTML('beforeend', `<div class="place-card">
          <div class="place-card__image" style="background: url(${this.link})">
            <button class="place-card__delete-icon"></button>
          </div>
          <div class="place-card__description">
            <h3 class="place-card__name">${this.name}</h3>
            <div class="place-card__like-block">
              <button class="place-card__like-icon"></button>
              <p class="place-card__like-counter">${this.likes}</p>
            </div>  
          </div>
          </div>`)
    this.setEventListeners();
    return this._element;
  }

  setEventListeners() {
    this._element.querySelector('.place-card__like-icon').addEventListener('click', this.like);
    this._element.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
    this._element.querySelector('.place-card__image').addEventListener('click', this.zoom);

  }

  removeEventListeners() {
    this._element.querySelector('.place-card__like-icon').removeEventListener('click', this.like);
    this._element.querySelector('.place-card__delete-icon').removeEventListener('click', this.remove);
    this._element.querySelector('.place-card__image').removeEventListener('click', this.zoom);
  }
}
