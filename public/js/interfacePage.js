import { toPage } from "./functions.js"

let curQuestionIndex = null

function interfacePage(ws) {

	const state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : { page: '' }
	const loading = document.querySelector('.loading')

	ws.onopen = function () {
		console.log("Соединение удалось")

		if (localStorage.getItem('session_id')) {
			ws.send(JSON.stringify({
				"action": "reconnect",
				"data": {
					"role": "Lead",
					"game": localStorage.getItem('session_id')
				}
			}))
		} else {
			ws.send(JSON.stringify({
				action: 'game'
			}))
		}
	}

	ws.onmessage = function (evt) {

		const msg = JSON.parse(evt.data)
		console.log(msg);

		switch (msg.action) {
			case 'game':
				localStorage.setItem('session_id', msg.data.ID)

			case 'reconnect':

				if (msg.error) {
					localStorage.clear()
					location.reload()
				}

				loading.classList.remove('active')
				toPage('lead-themes')

			case 'get_themes':
				updateThemes(msg.data.Themes)
				break;

			case 'answer_question':


			case 'select_theme':
				updateTheme(msg.data.Questions)
				break;



			// case 'answer_question':
			// 	updateTiles(msg.data.Questions)
			// 	break;

			// case 'to-tiles':
			// 	toPage('tiles')
			// 	break;
		}
	}
	function updateThemes(themes) {

		const themesBox = document.querySelector('.lead-themes__container')
		themesBox.innerHTML = ''
		themes.forEach(theme => {
			themesBox.insertAdjacentHTML('beforeend', `
			<div class="lead-themes-item ${theme.Status}" data-theme-id="${theme.id}">
				<div class="lead-themes-item__text">${theme.Title} (${theme.Answer})</div>
			</div>
			`)
		})

	}

	function updateTheme(questions) {

		const themeBox = document.querySelector('.lead-theme__list')
		themeBox.innerHTML = ''

		if (questions.findIndex(q => q.Status === 'solved') !== -1) {
			toPage('to-themes-btn')
			return
		}

		questions.sort((a, b) => b.Costs - a.Costs)
		const curQuestionIndex = questions.findIndex(q => q.Status === '')

		const question = questions[curQuestionIndex]
		themeBox.insertAdjacentHTML('beforeend', `
			<div class="lead-theme__item ${question.Status}" data-question-id="${question.id}">
				<div class="lead-theme__header">
					<div class="lead-theme__text">Вопрос ${curQuestionIndex + 1}</div>
					<div class="lead-theme__points"><span>${question.Costs}</span> баллов</div>
				</div>
				<div class="lead-theme__actions">
					<button class="lead-theme__apply-btn btn">Правильно</button>
					<button class="lead-theme__deny-btn btn">Неправильно</button>
				</div>
			</div>
			`)
		toPage('lead-theme')
	}

	function updateTiles(questions) {
		const tilesBox = document.querySelector('.intro-tiles__container')

		questions.forEach((q, i) => {
			tilesBox.insertAdjacentHTML('beforeend', `
						<div class="intro-tiles-item ${q.Solved ? 'checked' : ''}" data-tiles-id="${i}">
							<div class="intro-tiles-item__header">
								<div class="intro-tiles-item__number">${i + 1}</div>
								<div class="intro-tiles-item__image">
									<img src="${q.url_question}" alt="">
								</div>
								<button class="intro-tiles-item__apply-btn">Выбрать</button>
							</div>
							
							<div class="intro-tiles-item__descr">${q.question}</div>
						</div>
					`)
		});
	}

	document.addEventListener('click', function (evt) {
		const target = evt.target

		if (target.hasAttribute('data-page-target')) {
			toPage(target.dataset.pageTarget)
		} else if (target.classList.contains('intro-tiles-item__apply-btn') && !target.classList.contains('checked')) {
			curQuestionIndex = +target.closest('.intro-tiles-item').dataset.tilesId

			ws.send(JSON.stringify({
				"action": "select_question",
				"data": {
					"question": curQuestionIndex,
					"game": localStorage.getItem('session_id')
				}
			}))
		} else if (target.classList.contains('members__back-btn')) {
			ws.send(JSON.stringify({
				action: "to-tiles",
				data: localStorage.getItem('session_id')
			}))
		} else if (target.classList.contains('lead-themes-item')) {
			ws.send(JSON.stringify({
				action: 'select_theme',
				data: {
					game: localStorage.getItem('session_id'),
					theme: +target.dataset.themeId
				}
			}))

			toPage('lead-theme')
		} else if (target.classList.contains('lead-theme__deny-btn')) {
			const questionId = +target.closest('.lead-theme__item').dataset.questionId

			ws.send(JSON.stringify({
				action: 'answer_question',
				data: {
					game: localStorage.getItem('session_id'),
					status: 'failed',
					id: questionId
				}
			}))
		} else if (target.classList.contains('lead-theme__apply-btn')) {
			const questionId = +target.closest('.lead-theme__item').dataset.questionId

			ws.send(JSON.stringify({
				action: 'answer_question',
				data: {
					game: localStorage.getItem('session_id'),
					status: 'solved',
					id: questionId
				}
			}))

			ws.send(JSON.stringify({
				action: 'get_themes',
				data: localStorage.getItem('session_id')
			}))

		} else if (target.classList.contains('to-themes-btn__btn')) {
			ws.send(JSON.stringify({
				action: 'to-tiles',
				data: localStorage.getItem('session_id')
			}))
			toPage('lead-themes')
		}
	})
}
export default interfacePage