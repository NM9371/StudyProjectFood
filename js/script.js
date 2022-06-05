window.addEventListener('DOMContentLoaded', async () => {
    //tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent(0);
    
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if ( target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
    
    //timer
    
    const deadLine = '2022-07-11';
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) -  Date.parse(new Date()),
              days = (Math.floor(t/(1000*60*60*24))+'').padStart(2,'0'),
              hours = (Math.floor((t/(1000*60*60))%24)+'').padStart(2,'0'), //
              minutes = (Math.floor((t/(1000*60))%60)+'').padStart(2,'0'),
              seconds = (Math.floor((t/(1000))%60)+'').padStart(2,'0');
              return {
                  'total': t,
                  'days': days,
                  'hours': hours,
                  'minutes': minutes,
                  'seconds': seconds
              };
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
            updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = t.days;
            hours.innerHTML = t.hours;
            minutes.innerHTML = t.minutes;
            seconds.innerHTML = t.seconds;
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadLine);
    // modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        //clearInterval(modalTimerID);
    }

    modalTrigger.forEach(btn => {btn.addEventListener('click', () => {
        openModal();
    });});

    modal.addEventListener('click', (e) => {
        if (e.target===modal || e.target.getAttribute('data-close') == '') {closeModal();}
    });

    document.addEventListener('keydown', (e) => {
        if  (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    //const modalTimerID = setTimeout(openModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight) {
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
   }

    window.addEventListener('scroll', showModalByScroll);

    //классы для карточек
    
    class MenuCard {
        constructor(pic, alt, title, descr, price, parentSelector, ...classes) {
            this.pic=pic;
            this.alt=alt;
            this.title=title;
            this.descr=descr;
            this.price=price;
            this.classes=classes;
            this.parent=document.querySelector(parentSelector);
        }

        render() {
            const element = document.createElement('div');
            this.classes.forEach(className => element.classList.add(className)); 
            element.innerHTML = `
            <img src="${this.pic}" alt="${this.alt}">
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;
            this.parent.append(element);
        }
    }
    // new MenuCard(
    //     "img/tabs/vegy.jpg",
    //     'Меню "Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     '229',
    //     '.menu .container',
    //     'menu__item',
    //     'big'
    // ).render();
    // new MenuCard(
    //     "img/tabs/elite.jpg",
    //     'Меню “Премиум”',
    //     'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    //     '550',
    //     '.menu .container',
    //     'menu__item',
    //     'big'
    // ).render();
    // new MenuCard(
    //     "img/tabs/post.jpg",
    //     'Меню "Постное"',
    //     'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    //     '430',
    //     '.menu .container',
    //     'menu__item',
    //     'big'
    // ).render();

    function renderMenus(url) { 
        fetch(url,)
        .then(response => {return response.json();})
        .then(data => {
            data.forEach(x => {
                new MenuCard(
                    x.pic,
                    x.alt,
                    x.title,
                    x.descr,
                    x.price,
                    '.menu .container',
                    'menu__item',
                    'big'
                ).render();
            });
        
        });
    }

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'        
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            
            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });

            const json = JSON.stringify(object);

            fetch(https, {
                method: "POST",
                headers: {
                    'accept': '*/*',
                    'Content-type': 'application/json-patch+json'
                },
                body: json,
            }).then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }
    

    function showThanksModal (message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    const https="https://localhost:5001/api/Menu";
    renderMenus(https);

});