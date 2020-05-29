class Api {
    constructor(options) {
      this.options = options;
      this.url = this.options.baseUrl;
      this.headers = this.options.headers;
      this.authorization = this.headers.authorization;
      this.contentType = this.headers['Content-Type'];
    }
  
    getUserInfo() {
        return fetch(`${this.url}/users/me`, {
            method: 'GET',
            headers: {
                authorization: this.authorization
            }
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
                // Done Надо исправить (Спринт 9): Класс Api и данный метод, в частности, не должны изменять DOM,
                // он отвечает лишь за отправку запросов и получение информации с сервера.
                // Давайте исправим это, с остальными методами класса Api в этом плане всё в порядке.

            .catch(err => {
                console.log(err);
            })
    }

    getInitialCards() {
        return fetch(`${this.url}/cards`, {
            method: 'GET',
            headers: {
                authorization: this.authorization
            }
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    editUserInfo(name, about) {
        return fetch(`${this.url}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: this.authorization,
                'Content-Type': this.contentType
            },
            body: JSON.stringify({ name, about })
                // Можно лучше (Спринт 9): Здесь нет необходимости использовать интерполяцию строк, можно написать короче:
                //
                // body: JSON.stringify({ name, about });
                //
    
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
        .catch(err => {
            console.log(err);
        })
    }
  
    addNewCard(name, link) {
        return fetch(`${this.url}/cards`, {
            method: 'POST',
            headers: {
                authorization: this.authorization,
                'Content-Type': this.contentType
            },
            // Можно лучше (Спринт 9): Нет необходимости использовать интерполяцию строк.
            body: JSON.stringify({ name, link })
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
        .catch(err => {
            console.log(err);
        })
    }

    deleteCard(cardId) {
        return fetch(`${this.url}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                authorization: this.authorization
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
        .catch(err => {
            console.log(err);
        })
    }

    putLike(cardId) {
        fetch(`${this.url}/cards/like/${cardId}`, {
            method: 'PUT',
            headers: {
                authorization: this.authorization
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
        .catch(err => {
            console.log(err);
        })
    }

    removeLike(cardId) {
        fetch(`${this.url}/cards/like/${cardId}`, {
            method: 'DELETE',
            headers: {
                authorization: this.authorization
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
        .catch(err => {
            console.log(err);
        })
    }

  }
  
