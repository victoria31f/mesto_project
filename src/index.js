import "./style.css";
import Api from './script/api.js';
import Card from './script/card.js';
import CardList from './script/cardList.js';
import FormValidator from './script/formValidator.js';
import Popup from './script/popup.js';
import UserInfo from './script/userInfo';

const container = document.querySelector('.places-list');
const buttonNewCard = document.querySelector('.user-info__button');
const newCardPopupElem = `
    <div class="field-not-clickable">
      <h3 class="popup__title field-not-clickable">Новое место</h3>
      <form class="popup__form field-not-clickable" id="popup" name="new">
          <input type="text" name="name" id="imgname" class="popup__input popup__input_type_name field-not-clickable" placeholder="Название">
          <span class="error-message" id="error-imgname"></span>
          <input type="URL" name="link" id="link" class="popup__input popup__input_type_link-url field-not-clickable" placeholder="Ссылка на картинку">
          <span class="error-message" id="error-link"></span>
          <button type class="button popup__button field-not-clickable">+</button>
      </form>
    </div>`

const userInfoBlock = `
    <div class="field-not-clickable">
      <h3 class="popup__title field-not-clickable">Редактировать профиль</h3>
      <form class="popup__form field-not-clickable" novalidate id="edit-profile" name="user-profile">
          <input type="text" name="username" id="username" required class="popup__input popup__input_type_username field-not-clickable" placeholder="Имя">
          <span class="error-message" id="error-username"></span>
          <input type="text" name="about" id="about" required class="popup__input popup__input_type_about field-not-clickable" placeholder="О себе">
          <span class="error-message" id="error-about"></span>
          <button type class="edit-profile__button field-not-clickable" id="edit-profile__button">Сохранить</button>
      </form>
    </div>`

const buttonEditProfile = document.querySelector('.user-info__edit-button');


const api = new Api({
    baseUrl: 'https://praktikum.tk/cohort10',
    headers: {
        authorization: '5c788b82-fc9e-4eb0-ad75-9ff368bd7858',
        'Content-Type': 'application/json'
    }
});


const submitCardHandler = (event) => {
    event.preventDefault();
    api.addNewCard(document.forms['new'].name.value, document.forms['new'].link.value)
        .then(data => {
            cardList.addCard(data.name, data.link, data.likes.length, data._id);
            popupNewCard.closeActions();
        });
}

const newCardPopupHandler = () => {
    popupNewCard.open();
    /*REVIEW. Можно лучше. Наверное нет необходимости при каждом сабмите форм создавать новый экземпляр FormValidator, лучше поместить
    создание двух (для каждой формы по одному) экземпляров вне всяких функций и обращаться к ним в слушателях сабмита форм.
    */
    const validationAddCard = new FormValidator(document.forms['new']);
    validationAddCard.checkValidityInitial();
    validationAddCard.setEventListeners();
    validationAddCard.setSubmitButtonState();
    document.forms['new'].addEventListener('submit', submitCardHandler);
}

const closeEditProfile = () => {
    popupEditProfile.closeActions();
}

const uploadUserInfo = (name, about) => {
    return api.editUserInfo(name, about);
}

const editProfileHandler = () => {
    popupEditProfile.open();
    const userInfo = new UserInfo(
        document.forms['user-profile'],
        closeEditProfile,
        uploadUserInfo,
        document.querySelector('.user-info__name'),
        document.querySelector('.user-info__job')
    );
    userInfo.setListenerButtonEdit();
    const validationUser = new FormValidator(document.forms['user-profile']);
    validationUser.setEventListeners();
    validationUser.setSubmitButtonState();
}

const zoom = (event) => {
    if (event.target.classList.contains('place-card__image')) {
        const image = event.target.style.backgroundImage.slice(4, -1).replace(/['"]/g, "");
        const imageZoomed = `<img class="image-popup__image field-not-clickable" src='${image}'>`;
        const popupZoom = new Popup(imageZoomed, 'image-popup__content');
        popupZoom.open();
    }
}

const deleteCard = (id) => {
    return api.deleteCard(id);
}

const newCard = (name, link, likes) => {
    const card = new Card(name, link, likes, zoom, deleteCard);
    return card.create();
}

const getUserInfo = () => {
    return api.getUserInfo();
}

const popupNewCard = new Popup(newCardPopupElem, 'popup__content');
const popupEditProfile = new Popup(userInfoBlock, 'popup__content');
const cardList = new CardList(container, newCard, getUserInfo);


api.getUserInfo()
    .then(data => {
        document.querySelector('.user-info__name').textContent = data.name;
        document.querySelector('.user-info__job').textContent = data.about;
        document.querySelector('.user-info__photo').style.backgroundImage = `url('${data.avatar}')`;
    });

api.getInitialCards().then(data => cardList.render(data));

buttonNewCard.addEventListener('click', newCardPopupHandler);
buttonEditProfile.addEventListener('click', editProfileHandler);