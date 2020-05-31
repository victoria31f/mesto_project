export default class FormValidator {
    //конструктор должен принимать один из двух аргументов: элемент формы или элемент попапа, внутри которого находится эта форма.
    constructor (form) {
      this.form = form;
      this.submitButton = document.querySelector(`.${this.form.id}__button`);
    }
  
    // Возвращает true если длина больше 1 и меньше 30
    validateValueLength(value) {
      const length = value.length;
      return length > 1 && length < 30;
    }
  
    //Возвращает true если поле заполнено
    validateValueFilled (value) {
      return value !== '';
    }
  
    //Возвращает true если в поле вставлен URL
    validateUrl (value) {
      return value.validity.typeMismatch;
    }
  
    //чтобы валидировать поля. Метод показывает ошибку, если инпуты не проходят валидацию. Если проходят — скрывает ошибку.
    checkInputValidity (elem) {
      this.error = document.querySelector(`#error-${elem.id}`);
  
      if (!this.validateValueFilled(elem.value)) {
        this.error.textContent = 'Это обязательное поле';
        return false;
      }
  
      if (elem.id !== 'link' && !this.validateValueLength(elem.value)) {
        this.error.textContent = 'Должно быть от 2 до 30 символов';
        return false;
      }

      if (elem.id === 'link' && this.validateUrl(elem)) {
        this.error.textContent = 'Здесь должна быть ссылка';
        return false;
      }
  
      this.error.textContent = '';  
      return true;
    }
  
    //чтобы делать кнопку сабмита активной и неактивной. Состояние кнопки сабмита зависит от того, прошли все поля валидацию или нет. Этот метод должен вызываться при любом изменении данных формы. Если поля в порядке, кнопка становится активной. Если одно из полей не прошло валидацию, или пользователь его не заполнил, — кнопка неактивна.
    setSubmitButtonState () {
      if (Array.from(document.querySelectorAll('.popup__input')).every((elem) => elem.valid !== false)) {
        this.submitButton.removeAttribute('disabled');
        this.submitButton.classList.add(`${this.form.id}__button_active`);
      } else {
        this.submitButton.setAttribute('disabled', true);
        this.submitButton.classList.remove(`${this.form.id}__button_active`);
      }
  
    }
  
    handleValidate = (event) => {
      event.target.valid = this.checkInputValidity(event.target);
      this.setSubmitButtonState();
  
    }
  
    //чтобы добавлять обработчики. Добавляет необходимые для валидации обработчики всем полям формы.
    setEventListeners () {
      this.form.querySelectorAll('.popup__input').forEach(elem => elem.addEventListener('input', this.handleValidate));
    }

    checkValidityInitial () {
      this.form.querySelectorAll('.popup__input').forEach(elem => {
        elem.valid = false;
        this.setSubmitButtonState();
      })
    }
  }
  
  