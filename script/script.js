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





/**
Можно лучше.
1.Нет необходимости при каждом сабмите форм создавать новый экземпляр FormValidator, лучше поместить
  создание двух (для каждой формы по одному) экземпляров вне всяких функций в index.js и обращаться к ним в слушателях сабмита форм.

  В этом же направлении надо подумать насчёт необходимости создания экземпляров класса UserInfo при каждом сабмите формы профиля.

  Чем меньше лишних переменных - тем больше свободной оперативной памяти и работа приложения становится оптимальнее.

*/


/*
Спринт №9:

В целом, работа выполнена неплохо, видно, что вы постарались выполнить дополнительные задания: добавление новой карточки,
отображение количества лайков, удаление карточки. Но есть несколько моментов, которые нужно поправить, чтобы работа
была принята.

Что надо исправить:
 V - Обновление информации профиля, удаление/добавление карточки должны происходить после получения успешного
    ответа от сервера. Сейчас даже в случае ошибки сервера информация на странице обновляется.
 V - Изображение профиля на странице тоже должно загружаться с сервера, не только name и about.
    В ответе сервера есть свойство avatar, которое нужно использовать для этой цели.
 V - Добавление новой карточки: при добавления карточки счетчик лайков отображает 'undefined', (после перезагрузки
    страницы меняется на 0).
 V - Удаление карточки: Следует отобразить confirm с подтверждением удаления, в соответствии с проектным заданием.
 V - Метод getUserInfo() класса Api не должен напрямую менять DOM, см. комментарий в коде.
  - Комментарии "Надо исправить" в классе UserInfo, CardList.

Обратите внимание, что рекомендации по правкам могут добавляться порционно, по мере исправления текущих.
*/

/*
Спринт 9, 2ая итерация
  Супер, бОльшая часть работы сделана: теперь данные страницы обновляются после успешного запроса к серверу,
  undefined в счетчике исправлен, confirm добавлен, api класс не трогает DOM, аватарка грузится с сервера.
  Осталось совсем немного.

  Что надо исправить, чтобы работа была принята:
   V - Класс CardList: Отлично, избавились от харкодного id, но давайте попробуем обойтись без использования глобальной
      переменной, см. комментарий в коде класса.
   V - Класс UserInfo: Мы пока не до конца избавились от использования document в классе, давайте исправим до конца,
      см. комментарии в коде класса.
   V - Попап (редактирование пользователя/добавление карточки) должен закрываться только после успешно выполненного запроса
      к серверу (а не по событию submit).
   V - Карта должна удаляться после ответа сервера.

  Что можно сделать лучше:
    - Для поддержания читаемости кода будет лучше упорядочить объявление переменных/функций и добавление обработчиков. 
      Обычно, вначале объявляются переменные, затем функции и добавляются обработчики (имеется ввиду данный файл script.js).
      Это поможет в дальнейшем легко поддерживать и изменять код.

*/

/*
Спринт 9, 3-я итерация

Отлично, вы справились, поздравляю!

Что можно сделать лучше:
  - Сейчас мы отправляем два запроса getUserInfo (второй для получения user id), но лучше бы обойтись одним.
    Я бы посоветовал вынести создание экземпляра UserInfo из обработчика события на уровень выше, тогда мы
    сможем получить user id, присвоить его свойству экземпляра класса UserInfo и передать экземпляр в CardList.
    Советую поработать над этим. В общем, желательно вместо двух запросов getUserInfo использовать один.
    Но это не обязательно, работа принята, спасибо.
*/