
export default class CardList {
  constructor(cardsContainer, newCardFunction, getUserInfo) {
    this.container = cardsContainer;
    this.createCard = newCardFunction;
    this.getUserInfo = getUserInfo;
  }

  _getUserId() {
    return this.getUserInfo()
      .then(data => {
        this.uid = data._id;
      })
  }

  render(data) {
    this._getUserId()
      .then(() => {
        for (const elem of data) {
          this.addCard(elem.name, elem.link, elem.likes.length, elem._id);
          // this.card.id = elem._id;
          // Надо исправить (Спринт 9): Здесь нужно избавиться от хардкода id и использовать значение,
          // полученное от сервера (и где-нибудь сохраненное) при загрузке информации профиля.
    
          // Надо исправить: (Спринт 9, 2ая итерация): Давайте попробуем обойтись без использования глобальных переменных
          // в классе. Можно использовать для хранения id пользователя экземпляр класса UserInfo и передавать его в
          // конструктор класса CardList, тогда здесь мы сможет обращаться к свойству this.userInfo.id, а не к глобальной
          // переменной userId.
          if (elem.owner._id !== `${this.uid}`) {
            this.card.querySelector('.place-card__delete-icon').classList.add('place-card__delete-icon_invisible');
          }
        }
    
      })
  }

  addCard(name, link, likes, id) {
    this.card =  this.createCard(name, link, likes);
    this.card.id = id;
    this.container.appendChild(this.card);
    }
}
