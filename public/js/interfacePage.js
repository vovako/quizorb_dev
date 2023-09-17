import { toPage } from "./functions.js"

const MEMBERS = []
const QUESTIONS = [
	{ Question: "Пассажир первого поезда «Самара-Оренбург».Один из величайших писателей мировой литературы.", Answer: "ЛЕВ НИКОЛАЕВИЧ ТОЛСТОЙ", IMGAnswer: "https://sun6-20.userapi.com/impg/_LOvXE4SiaeIBwwHbzjr2bzakg6gfiC2mQ1a-g/czlixfGFsvM.jpg?size=576x680&quality=95&sign=1e5d9d5301e81fc2457e656153ff8939&c_uniq_tag=eJYBYp_YqUNS2ysp3JS5vOTFSvGwOrMWr2iTRtUDSEA&type=album", IMGQuestion: "https://xn----7sbbaazuatxpyidedi7gqh.xn--p1ai/i/trans/parovoz/28.jpg", Solved: false },
	{ Question: "«Отец» Штирлица. Работал в Оренбуржье над биографией лидера белого казачества атамана Александра Дутова.", Answer: "ЮЛИАН СЕМЕНОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "По итогу визита в Оренбург и Бердскую слободу местные жители сделали вывод – приезжал антихрест. Особенно оренбуржцев поразила темная кожа и длинные ногти гостя.", Answer: "АЛЕКСАНДР СЕРГЕЕВИЧ ПУШКИН", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Массаракш — распространённое ругательство, употребляемое жителями вымышленной планеты Саракш, дословно обозначающее «Мир наизнанку». Название «Саракш» было	образовано от названия посёлка Саракташ	Оренбургской области, аналогично другому фантастическому топониму в творчестве братьев — названию фигурирующего в романе «Отягощённые злом, или Сорок лет спустя» города Ташлинск, образованного от наименования села Ташла, также расположенного в Оренбургской области.", Answer: "АРКАДИЙ И БОРИС СТРУГАЦКИЕ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Наставник цесаревича Александра Николаевича, посещал Оренбуржье вместе со своим учеником. Автор	слов государственного гимна Российской империи «Боже, Царя храни!».", Answer: "ВАСИЛИЙ АНДРЕЕВИЧ ЖУКОВСКИЙ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "С Оренбургским краем был связан с начала своей биографии Его отец армейским офицер, последние годы жизни (1749-1754) служил в Оренбурге, где будущий поэт получил первоначальное образование. \n«Заметил Пушкина» и «в гроб сходя благословил».", Answer: "ГАВРИЛА РОМАНОВИЧ ДЕРЖАВИН", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Отец русской истории, именно он придал современное толкование термину «промышленность». Родился в Преображенке в Бузулукского уезда.", Answer: "НИКОЛАЙ МИХАЙЛОВИЧ КАРАМЗИН", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Назовите известного писателя.", Answer: "СЕРГЕЙ ТИМОФЕЕВИЧ АКСАКОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Благодаря ему мы знаем какой бывает «Горячий снег» и том как «Батальоны просят Огня».", Answer: "ЮРИЙ ВАСИЛЬЕВИЧ БОНДАРЕВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Советский палеотолог, писатель-фантаст и социальный мыслитель. Автор романов «Туманность Андромеды», «Таис Афинская» и «Лезвие бритвы». Участвовал в раскопках Карталинского рудгого поля.", Answer: "ИВАН АНТОНОВИЧ ЕФРЕМОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Актёр Магнитогорский драматический театр имени А. С. Пушкина Оренбургский областной драматический театр	имени М. Горького, а потом и Московский драматический театр на Малой Бронной. \nИменно он попросил Максима Максимовича Исаева остаться после совещания.", Answer: "ЛЕОНИД СЕРГЕЕВИЧ БРОНЕВОЙ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Жил в Оренбуржье до Большого каретного.", Answer: "ВЛАДИМИР СЕМЁНОВИЧ ВЫСОЦКИЙ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Французский рестлер, более известным под именем	Французский ангел. Родился на территории оренбургской губернии. Прототипом какого мультипликационного персонажа она стал?", Answer: "МОРИС ТИЙЕ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Голос Гарри Поттера и Фродо Беггинса, быший солист группы Revolvers.", Answer: "АЛЕКСЕЙ ЕЛИСТРАТОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Назовите популярного исполнителя.", Answer: "ЮРА ШАТУНОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "", Answer: "АННА ЛИННИКОВА", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "", Answer: "АЛЕКСАНДР ЗАСС", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "", Answer: "ОЛЬГА ОСТРОУМОВА", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "", Answer: "ЛАРИСА ГУЗЕЕВА", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "", Answer: "НИКОЛАЙ II", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Император Всероссийский, который по одной из легенд закончил жизнь как старец Федор Кузьмич.", Answer: "АЛЕКСАНДР I", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Освободитель и Вешатель, пережил 7 покушений.", Answer: "АЛЕКСАНДР II", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "", Answer: "ПЕТР АРКАДЬЕВИЧ СТОЛЫПИН", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Этот Оренбуржец однажды стал руководителем Советского Союза, правда не на долго. В настоящее время его память никак не увековечена в нашем городе, вероятно в связи со спорным характером его наследия. Последние 33 года жизни провёл практически в забвении и отчуждении от политики.", Answer: "ГЕОРГИЙ МАКСИМИЛИАНОВИЧ МАЛЕНКОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Весь мир сейчас идёт наоборот. Назовите автора цитаты.", Answer: "ВИКТОР СТЕПАНОВИЧ	ЧЕРНОМЫРДИН", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Герой обороны Сталинграда. В американском фильме «Враг у ворот» его роль исполнил известный актёр Джуд Лоу.	Его книга является настольным пособием снайперов армии США. Кто он?", Answer: "ВАСИЛИЙ ЗАЙЦЕВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Один из самых знаминитых героев Великой Отечественной войны. Его подвиг был повторён более 400 раз. Наш герой проходил обучение в Краснохолмском пехотном училище. Кто он?", Answer: "АЛЕКСАНДР МАТРОСОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Вероятнее всего именно этот человек и доблесть ввереного ему военного соединения остановили нацистов в Сталинграде. Дважды герой Совесткого Союза, уроженец	Шарлыка, кто он?", Answer: "АЛЕКСАНДР ИЛЬИЧ	РОДИМЦЕВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Советская лётчица, единственная в мире женщина, совершившая воздушный таран, обучалась в Оренбургской военной авиационной школе лётчиков", Answer: "ЕКАТЕРИНА ЗЕЛЕНКО", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "17 марта 2016 года, находившийся неделю в тылу противника, был окружён боевиками «Исламского государства» в районе населённого пункта Тадмор (провинция Хомс, Сирия). Старший лейтенант вступил в бой с террористами и не желая	сдаваться в плен, вызвал авиаудар на себя. Вместе с	геройски погибшим офицером были уничтожены и окружившие его боевики «Исламского государства». Назовите фамилию героя.", Answer: "АЛЕКСАНДР ПРОХОРЕНКО", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Вместе с группой «Вымпел» прибыл в город Беслан республики Северная Осетия — Алания, где 1 сентября 2004 года более тридцати террористов под захватили в заложники свыше 1100 детей и взрослых в здании школы № 1.\n\nПосле того, как на третий день в спортзале, где содержались большинство заложников, произошли взрывы, вызвавшие частичное	обрушение крыши и стен спортзала, выжившие люди стали разбегаться. Оперативно-боевая группа, в составе которой был наш герой, получила приказ на штурм здания, так как боевики открыли шквальный огонь по заложникам. Первым проник в помещение столовой, куда боевики перегнали выживших после взрывов в спортзале заложников, и лично	уничтожил одного террориста. Когда другой бандит бросил в скопление людей гранату, спас жизни заложникам, закрыв их от взрыва своим	телом. Уроженец города Орска. Назовите фамилию героя.", Answer: "АНДРЕЙ ТУРКИН", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Русский военный, участник Белого движения, атаман Оренбургского казачества, генерал-лейтенант. Предводитель казацкого восстания на Урале в 1918	году. Участник «Голодного похода». Был ликвидирован	диверсионной группой ВЧК в Китае в 1921 году.", Answer: "АЛЕКСАНДР ИЛЬИЧ ДУТОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Лётчик и воздухоплаватель, первый в мире летчик-бомбардировщик, первый в Российской Империи военный летчик-инструктор. Окончил Оренбургский	Неплюевский кадетский корпус.", Answer: "ГЕОРГИЙ ГОРШКОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Одна из самых известных исторических личностей эпохи Гражданской войны в России. Увековечен в книге Дмитрия	Фурманова «Чапаев» и одноимённом фильме братьев	Васильевых, а также в многочисленных анекдотах.", Answer: "ВАСИЛИЙ ИВАНОВИЧ ЧАПАЕВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Оренбургский космонавт. Отец космонавта.", Answer: "РОМАНЕНКО ЮРИЙ ВИКТОРОВИЧ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Первый советский космонавт, побывавший в космосе дважды. Первый космонавт, погибший в ходе полёта. Его космический аппарат разбился в Оренбургской области.", Answer: "КОМАРОВ ВЛАДИМИР	МИХАЙЛОВИЧ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Назовите фамилию, имя и отчество жены Гагарина в девичестве.", Answer: "ВАЛЕНТИНА ИВАНОВНА ГОРЯЧЕВА", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Светский учёный-радиотехник и кибернетик, основоположник отечественной школы биологической кибернетики и биотехнических систем и технологий. Родился в Оренбурге, где его семья проживала на улице Советской.", Answer: "АКСЕЛЬ БЕРГ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Советский физик, академик Академии наук СССР, один из основателей совесткой атомной школы. Родился и вырос в Оренбурге.", Answer: "ПЁТР ИВАНОВИЧ ЛУКИРСКИЙ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Советский и российский физик, академик РАН (2019). Директор Института физики твердого тела РАН (2002—2017),	академик-секретарь Отделения физических наук (с 2022), член ряда комиссий, советов и иных авторитетных органов РАН. Родился и вырос в Оренбурге.", Answer: "ВИТАЛИЙ ВЛАДИМИРОВИЧ КВЕДЕР", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Последний президент Академии наук СССР, учёный в области вычислительной математики, физики атмосферы, геофизики. Уроженец села Петрохеронец Грачёвского	района Оренбургской губернии.", Answer: "ГУРИЙ ИВАНОВИЧ МАРЧУК", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Кристаллограф, минералог и математик. Академик Российской академии наук, директор петербургского Горного института (1905—1910). Член организации «Земля и Воля». Родился в Оренбурге.", Answer: "ЕВГРАФ СТЕПАНОВИЧ ФЕДОРОВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "", Answer: "ИГОРЬ ЯКОВЛЕВИЧ СТЕЧКИН", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Немецкий географ, натуралист и путешественник, один из основателей географии как самостоятельной науки", Answer: "БАРОН ФРИДРИХ	ВИЛЬГЕЛЬМ ГЕНРИХ АЛЕКСА́НДР ФОН	ГУ́МБОЛЬДТ", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "«Один из наиболее выдающихся естествоиспытателей всех стран и времён…» — так начинается персоналия Ф. П. Кеппена об учёном в «Русском биографическом словаре». «…Природный немец, родом пруссак, <…> отдавший всю жизнь России… отличался <…> широтой своих научных интересов, попытками научного, глубокого творчества в области искания обобщений в наблюдательных науках, <…> колоссальной работоспособностью и точным владением вечными	элементами научного метода…», — сказал В. И.Вернадский", Answer: "ПЁТР СИМОН ПАЛЛАС", IMGAnswer: "", IMGQuestion: "", Solved: false },
	{ Question: "Первый «Заслуженый географ Российской Федерации». Вице-президент Русского географического общества", Answer: "АЛЕКСАНДР АЛЕКСАНДРОВИЧ ЧИБИЛЕВ", IMGAnswer: "", IMGQuestion: "", Solved: false },
]
let curQuestionIndex = null

function interfacePage() {
	const viewWin = window.open(location.origin + '/view.html')

	const tilesBox = document.querySelector('.tiles__container')
	QUESTIONS.forEach((q, i) => {
		tilesBox.insertAdjacentHTML('beforeend', `<div class="tiles-item">${i + 1}</div>`)
	});

	const openMembersBtn = document.querySelector('.intro-members__open-btn')
	openMembersBtn.addEventListener('click', function (evt) {
		const mainBlock = openMembersBtn.parentElement
		if (!mainBlock.classList.contains('active')) {
			openMemberPanel()
		} else if (evt.target === openMembersBtn.querySelector('img')) {
			mainBlock.style.bottom = null
			mainBlock.classList.remove('active')
		}
	})
	function openMemberPanel() {
		const mainBlock = openMembersBtn.parentElement
		const wrapper = openMembersBtn.nextElementSibling
		mainBlock.style.bottom = wrapper.clientHeight + 'px'
		mainBlock.classList.add('active')
	}

	const addMemberBtn = document.querySelector('.intro-members__add-member-block button')
	addMemberBtn.addEventListener('click', function () {
		const addMemberBlock = addMemberBtn.closest('.intro-members__add-member-block')
		const surname = addMemberBlock.querySelector('[name="surname"]')
		const name = addMemberBlock.querySelector('[name="name"]')
		addMemberBlock.insertAdjacentHTML('afterend', `
	<div class="intro-members-item">
		<div class="intro-members-item__surname">${surname.value}</div>
		<div class="intro-members-item__name">${name.value}</div>
	</div>
	`)
		MEMBERS.push({
			name: name.value,
			surname: surname.value,
			id: MEMBERS.length,
			points: 0
		})

		surname.value = ''
		name.value = ''
		updateMembersCount()
		openMemberPanel()
	})

	function updateMembersCount() {
		const membersCountEl = document.querySelector('.intro-members__open-btn span')
		const membersCount = document.querySelectorAll('.intro-members-item').length
		membersCountEl.textContent = membersCount
	}

	const beginGameBtn = document.querySelector('.intro__begin-quiz-btn')
	beginGameBtn.addEventListener('click', function () {
		viewWin.document.querySelector('.tiles').innerHTML = document.querySelector('.tiles').innerHTML
		toTiles()
	})

	function membersReset() {
		document.querySelector('.members__to-tiles').classList.remove('active')
		const membersBox = document.querySelector('.members__list')
		membersBox.classList.remove('lock')
		membersBox.innerHTML = ''

		MEMBERS.forEach(member => {
			membersBox.insertAdjacentHTML('beforeend', `
			<div class="members-item" data-member-id="${member.id}">
				<div class="members-item__name">${member.surname} ${member.name}</div>
				<button class="members-item__deny-btn">Неправильно</button>
				<button class="members-item__apply-btn">Правильно</button>
				<div class="members-item__points">${member.points}</div>
			</div>
			`)
		})
	}

	function toTiles() {
		const qStatuses = Array.from(QUESTIONS.map(q => q.Solved))

		const msg = {
			msg: 'tiles',
			data: qStatuses
		}
		viewWin.postMessage(JSON.stringify(msg), location.origin)

		toPage('tiles')
	}

	document.addEventListener('click', function (evt) {
		const target = evt.target

		if (target.classList.contains('members-item') && !target.classList.contains('active') && !target.classList.contains('disabled') && !target.classList.contains('solved') && !target.closest('.members__list.lock')) {
			document.querySelector('.members-item.active')?.classList.remove('active')
			target.classList.add('active')
		} else if (target.classList.contains('members-item__deny-btn')) {
			const item = target.closest('.members-item')
			item.classList.remove('active')
			item.classList.add('disabled')

			const members = document.querySelectorAll('.members-item')
			if (members.length === [...members].filter(m => m.classList.contains('disabled')).length) {
				document.querySelector('.members__to-tiles').classList.add('active')
			}

		} else if (target.classList.contains('members-item__apply-btn')) {
			const item = target.closest('.members-item')
			item.classList.remove('active')
			item.classList.add('solved')

			const memberId = +item.dataset.memberId
			const member = MEMBERS.filter(m => m.id === memberId)[0]
			member.points++

			const pointsEl = item.querySelector('.members-item__points')
			pointsEl.textContent = member.points
			target.closest('.members__list').classList.add('lock')
			document.querySelector('.members__to-tiles').classList.add('active')

			QUESTIONS[curQuestionIndex].Solved = true
			document.querySelectorAll('.tiles-item')[curQuestionIndex].classList.add('checked')

			toAnswer()
		} else if (target.hasAttribute('data-page-target')) {
			toPage(target.dataset.pageTarget)
		} else if (target.classList.contains('tiles-item') && !target.classList.contains('checked')) {

			toMembers(+target.textContent)
		} else if (target.parentElement.classList.contains('members__to-tiles')) {
			toTiles()
		}
	})

	function toMembers(questionNumber) {
		membersReset()

		curQuestionIndex = questionNumber - 1
		const msg = {
			msg: 'question',
			data: {
				Question: QUESTIONS[curQuestionIndex].Question,
				IMGQuestion: QUESTIONS[curQuestionIndex].IMGQuestion
			}
		}
		viewWin.postMessage(JSON.stringify(msg), location.origin)

		toPage('members')
	}

	function toAnswer() {
		const msg = {
			msg: 'answer',
			data: {
				Answer: QUESTIONS[curQuestionIndex].Answer,
				IMGAnswer: QUESTIONS[curQuestionIndex].IMGAnswer
			}
		}
		viewWin.postMessage(JSON.stringify(msg), location.origin)
	}

	window.onbeforeunload = function() {
		viewWin.close()
	}
}

export default interfacePage