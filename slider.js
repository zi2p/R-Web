function Slider(sldrId) {

	let id = document.getElementById(sldrId);
	if (id) {
		this.sldrRoot = id
	}
	else {
		this.sldrRoot = document.querySelector('.sim-slider')
	};

	// Slider objects
	this.sldrList = this.sldrRoot.querySelector('.sim-slider-list');
	this.sldrElements = this.sldrList.querySelectorAll('.sim-slider-element');
	this.sldrElemFirst = this.sldrList.querySelector('.sim-slider-element');
	this.leftArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-left');
	this.rightArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-right');
	this.indicatorDots = this.sldrRoot.querySelector('div.sim-slider-dots');

	// Initialization
	this.options = Slider.defaults;
	Slider.initialize(this)
};

Slider.defaults = {

	// Default options for the slider
	loop: true,     // Бесконечное зацикливание слайдера
	auto: true,     // Автоматическое пролистывание
	interval: 6000, // Интервал между пролистыванием элементов (мс)
	arrows: true,   // Пролистывание стрелками
	dots: true      // Индикаторные точки
};

Slider.prototype.elemPrev = function(num) {
	num = num || 1;

	let prevElement = this.currentElement;
	this.currentElement -= num;
	if (this.currentElement < 0) this.currentElement = this.elemCount-1;

	if (!this.options.loop) {
		if (this.currentElement == 0) {
			this.leftArrow.style.display = 'none'
		};
		this.rightArrow.style.display = 'block'
	};
	
	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if (this.options.dots) 
		this.dotOn(prevElement); this.dotOff(this.currentElement)
};

Slider.prototype.elemNext = function(num) {
	num = num || 1;
	
	let prevElement = this.currentElement;
	this.currentElement += num;
	if (this.currentElement >= this.elemCount) this.currentElement = 0;

	if (!this.options.loop) {
		if (this.currentElement == this.elemCount-1) {
			this.rightArrow.style.display = 'none'
		};
		this.leftArrow.style.display = 'block'
	};

	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if (this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
};

Slider.prototype.dotOn = function(num) {
	this.indicatorDotsAll[num].style.cssText =
             'background-color:#BBB; cursor:pointer;'
};

Slider.prototype.dotOff = function(num) {
	this.indicatorDotsAll[num].style.cssText =
             'background-color:#556; cursor:default;'
};

Slider.initialize = function(that) {
	that.elemCount = that.sldrElements.length; // Количество элементов

	// Variables
	that.currentElement = 0;
	let bgTime = getTime();

	// Functions
	function getTime() {
		return new Date().getTime();
	};

	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.elemNext()
			}
		}, that.options.interval)
	};

	if (that.elemCount <= 1) {   // Отключить навигацию
		that.options.auto = false;
                that.options.arrows = false; that.options.dots = false;
		that.leftArrow.style.display = 'none';
                that.rightArrow.style.display = 'none'
	};

	if (that.elemCount >= 1) {   // показать первый элемент
		that.sldrElemFirst.style.opacity = '1';
	};

	if (!that.options.loop) {
		that.leftArrow.style.display = 'none';  // отключить левую стрелку
		that.options.auto = false; // отключить автопркрутку
	}

	else if (that.options.auto) {   // инициализация автопрокруки
		setAutoScroll();
		// Остановка прокрутки при наведении мыши на элемент
		that.sldrList.addEventListener('mouseenter', function() {
                      clearInterval(that.autoScroll)
                }, false);
		that.sldrList.addEventListener('mouseleave', setAutoScroll, false)
	};

	if (that.options.arrows) {  // инициализация стрелок
		that.leftArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if (fnTime - bgTime > 1000) bgTime = fnTime; that.elemPrev()
			
		}, false);
		that.rightArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if (fnTime - bgTime > 1000) bgTime = fnTime; that.elemNext()
			
		}, false)
	}

	else {
		that.leftArrow.style.display = 'none';
                that.rightArrow.style.display = 'none'
	};

	if (that.options.dots) {  // инициализация индикаторных точек
		let sum = '', diffNum;
		for(let i=0; i<that.elemCount; i++) {
			sum += '<span class="sim-dot"></span>'
		};
		that.indicatorDots.innerHTML = sum;
		that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.sim-dot');
		
		for (let n=0; n<that.elemCount; n++) {
			that.indicatorDotsAll[n].addEventListener('click', function(){
				diffNum = Math.abs(n - that.currentElement);
				if (n < that.currentElement) {
					bgTime = getTime(); that.elemPrev(diffNum)
				}
				else if (n > that.currentElement) {
					bgTime = getTime(); that.elemNext(diffNum)
				}
			}, false)
		};
		that.dotOff(0);  
		for (let i=1; i<that.elemCount; i++) that.dotOn(i)
		
	}
};


document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");
    const inputFile = document.querySelectorAll(".upload-file__input");

    /////////// Кнопка «Прикрепить файл» ///////////
    inputFile.forEach(function(el) {
        let textSelector = document.querySelector(".upload-file__text");
        let fileList;

        // Событие выбора файла(ов)
        el.addEventListener("change", function (e) {

            // создаём массив файлов
            fileList = [];
            for (let i = 0; i < el.files.length; i++) {
                fileList.push(el.files[i]);
            }

            // вызов функции для каждого файла
            fileList.forEach(file => {
                uploadFile(file);
            });
        });

        // Проверяем размер файлов и выводим название
        const uploadFile = (file) => {

            // файла <5 Мб
            if (file.size > 5 * 1024 * 1024) {
                alert("Файл должен быть не более 5 МБ.");
                return;
            }

            // Показ загружаемых файлов
            if (file && file.length > 1) {
                if ( file.length <= 4 ) {
                    textSelector.textContent = `Выбрано ${file.length} файла`;
                }
                if ( file.length > 4 ) {
                    textSelector.textContent = `Выбрано ${file.length} файлов`;
                }
            } else {
                textSelector.textContent = file.name;
            }
        }

    });

    // Отправка формы на сервер
    const postData = async (url, fData) => { // имеет асинхронные операции

        // начало отправки
        // здесь можно оповестить пользователя о начале отправки

        // ждём ответ, только тогда наш код пойдёт дальше
        let fetchResponse = await fetch(url, {
            method: "POST",
            body: fData
        });

        // ждём окончания операции
        return await fetchResponse.text();
    };

    if (forms) {
        forms.forEach(el => {
            el.addEventListener("submit", function (e) {
                e.preventDefault();

                // создание объекта FormData
                let fData = new FormData(this);

                // Добавление файлов input type file
                let file = el.querySelector(".upload-file__input");
                for (let i = 0; i < (file.files.length); i++) {
                    fData.append("files[]", file.files[i]); // добавляем файлы в объект FormData()
                }

                // Отправка на сервер
                postData("./mail.php", fData)
                    .then(fetchResponse => {
                        console.log("Данные успешно отправлены!");
                        console.log(fetchResponse);
                    })
                    .catch(function (error) {
                        console.log("Ошибка!");
                        console.log(error);
                    });
            });
        });
    };

});