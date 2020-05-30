//Экземпляр этого класса должен хранить в себе данные пользователя: имя и информацию о себе, а также отображать эту информацию на странице.
class UserInfo {
  constructor(userEditForm, closeFormFunc, uploadUserInfoFunc, usernameElem, aboutElem) {
    this.form = userEditForm;
    this.nameElem = usernameElem;
    this.aboutElem = aboutElem;
    this.closeForm = closeFormFunc;
    this.uploadUserInfo = uploadUserInfoFunc;
  }

  setListenerButtonEdit = () => {
    this.setUserInfo(this.nameElem.textContent, this.aboutElem.textContent);
    this.setInputsValue();
    // Надо исправить (Спринт 9, 2-ая итерация): Используйте this.form вместо document.forms['user-profile']
    this.form.addEventListener('submit', this.updateUserInfo);
    // Надо исправить (Спринт 9, 2-ая итерация): Попап должен закрываться после успешно выполненного запроса к серверу,
    // а не по событию submit.
  }

  // Можно лучше (Спринт 9): Лучше будет сделать, чтобы метод получал username и about из параметров, а не из DOM.
  // Тогда его можно будет переиспользовать. Например, в updateUserInfo вы тоже обновляете поля объекта.
  // И он должен лишь обновлять данные внутри экземпляра класса. Для обновления полей формы тогда лучше написать
  // отдельный метод.

  //чтобы обновлять данные внутри экземпляра класса
  setUserInfo(name, about) {
    this.username = name;
    this.about = about;
  }

  setInputsValue() {
    this.form.elements.username.value = this.username;
    this.form.elements.about.value = this.about;
  }

  // Надо исправить (Спринт 9): Данные профиля должны обновляться только после того,
  // как запрос был успешно выполнен. Сейчас это происходит перед выполнением запроса.

  //чтобы отображать эти данные на странице
  updateUserInfo = (event) => {
    event.preventDefault();

    this.uploadUserInfo(this.form.elements.username.value, this.form.elements.about.value)
      .then(data => {
        this.setUserInfo(data.name, data.about);
        // Надо исправить (Спринт 9, 2-ая итерация):
        // Здесь можно тоже передать DOM элемент профиля на странице в конструктор и потом его изменять
        // (как this.form). Другой вариант - передать функцию обратного вызова (как this.closeForm, this.uploadUserInfoFunc),
        // которая будет здесь вызываться и изменять данные профиля на странице после того, как запрос к серверу был
        // успешно выполнен, например так:
        //
        //  this.renderProfile(data.name, data.about);
        //
        // Создание экземпляра UserInfo:
        //
        //  const userInfo = new UserInfo(
        //    document.forms['user-profile'],
        //    closeEditProfile,
        //    uploadUserInfo,
        //    renderProfile
        //  );

        // Можно лучше (Спринт 9, 3-я итерация): Нет необходимости использовать интерполяцию строк, можно
        // просто this.nameElem.textContent = data.name;
        this.nameElem.textContent = `${this.username}`;
        this.aboutElem.textContent = `${this.about}`;   
        this.closeForm(); 
      })



  }

}

// Надо исправить (Спринт 9): Мы не должны обращаться напрямую к document в данном классе. Лучше будет, например,
// передать элементы DOM, ассоциированные с профилем, такие как форма, присвоить их свойствами и работать с ними.

