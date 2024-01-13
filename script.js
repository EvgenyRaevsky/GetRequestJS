const container = document.querySelector('.container'); 
const cardUsers = document.getElementsByClassName('card');

function randQuantity() {
    // Задаем количество пользователей (минимум 30, максимум 100)
    return Math.ceil(Math.random() * 101 + 30);
}

function randColor() {
    // Без близких цветов к фону карточки и цвета иконки (чтобы не сливались)
    return Math.floor(Math.random() * 128 + 128 / 2);
}

let users = [];

async function getInfo() {
    const q = randQuantity();
    let res = await fetch(`https://fakerapi.it/api/v1/custom?_quantity=${q}&firstName=firstName&lastName=lastName&birthday=date&comment=text`);
    let data = await res.json('');

    // Пробегаемся по объекту, наполняя карточку его значениями по ключам
    Array.prototype.forEach.call(data.data, el => {
        users.push(el);
        const card = document.createElement('article');
        card.className = 'card';
        const cardTop = document.createElement('div');
        cardTop.className = 'card__top';

        const cardImg = document.createElement('div');
        cardImg.className = 'card__img';
        cardImg.style.backgroundColor = `rgb(${randColor()}, ${randColor()}, ${randColor()})`;
        const Img = new Image();
        Img.src = './user.png'
        cardImg.append(Img);

        const cardTitle = document.createElement('div');
        cardTitle.className = 'card__title';
        const h2 = document.createElement('h2');
        h2.innerText = `${el.firstName} ${el.lastName}`;
        const p = document.createElement('p');
        p.innerText = el.birthday;
        cardTitle.append(h2, p);

        cardTop.append(cardImg, cardTitle);

        const cardBottom = document.createElement('div');
        cardBottom.className = 'card__bottom';
        cardBottom.innerText = el.comment;

        card.append(cardTop, cardBottom);
        container.append(card);
    })

    // Создаем массив Имен и Фамилий пользователей (+заполняем) и получаем input 
    const search = document.querySelector('.search');
    const searchUsers = [];
    for (let i = 0; i < cardUsers.length; i++) {
        searchUsers.push(cardUsers[i].childNodes[0].childNodes[1].childNodes[0].textContent);
    }

    // Создаем блок который будет отображаться в случае если такой пользователь не будет найден
    const notFound = document.createElement('div');
    notFound.className = 'notFound';
    notFound.innerText = 'Nothing was found for your query'
    notFound.style.display = 'none';
    container.append(notFound);
    
    // Создаем массив в котором будут храниться Имя и Фамиля пользователся удовлетворяющего условиям поиска
    let searchUsersFilter = [];
    search.addEventListener('input', () => {
            // Отбираем пользователей у которых НА ДАННЫЙ МОМЕНТ Имя или Фамилия совпадают с информацией введенной пользователем в input
            // Например есть пользователи: "Mary Klein", "Ansel Mayer", "Patric Dach"
            // Пользователь успел ввести (НЕ важно с маленькой или большой буквы) "ma"
            // Код ниже отсекает Имя и Фамилию пользователей до длины введенного слова, т.е. 2 символа и сравнивает их с введенным value в input. 
            // Т.о. в отфильтрованный массив на данном этапе попадут "Mary Klein", "Ansel Mayer"
            searchUsersFilter = searchUsers.filter(el => {
                return search.value.toLowerCase() === el.split(' ')[0].slice(0, search.value.length).toLowerCase() || search.value.toLowerCase() === el.split(' ')[1].slice(0, search.value.length).toLowerCase();
            })
            // В этом цикле скрываются все карточки неудовлетворяющие условию поиска
            // Если отфильтрованный массив пустой отображается блок notFound
            for (let j = 0; j < cardUsers.length; j++) {
                if (searchUsersFilter.length) {
                    for (let k = 0; k < searchUsersFilter.length; k++) {
                        if (cardUsers[j].childNodes[0].childNodes[1].childNodes[0].textContent === searchUsersFilter[k]) {
                            notFound.style.display = 'none';
                            cardUsers[j].style.display = 'flex';
                            break;
                        } else {
                            cardUsers[j].style.display = 'none';
                        }
                    }
                } else {
                    cardUsers[j].style.display = 'none';
                    notFound.style.display = 'block';
                }
            }
        })
    }
    
    getInfo();