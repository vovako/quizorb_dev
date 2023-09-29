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
				updateTheme(msg.data.Questions)
				break;
			case 'select_theme':
				updateTheme(msg.data.Questions)
				const answerEl = document.querySelector('.lead-theme__answer')
				answerEl.textContent = msg.data.Answer
				break;
			case 'delete_game':
				localStorage.clear()
				location.reload()
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

		const themesBox = document.querySelector('.lead-themes__list')
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

		const themeContainer = document.querySelector('.lead-theme__container')
		const headerText = themeContainer.querySelector('.lead-theme__text')
		const headerPoints = themeContainer.querySelector('.lead-theme__points span')

		if (questions.findIndex(q => q.Status === 'solved') !== -1||questions.findIndex(q => q.Status === '') == -1) {
			toPage('to-themes-btn')
			return
		}

		questions.sort((a, b) => b.Costs - a.Costs)
		const curQuestionIndex = questions.findIndex(q => q.Status === '')

		const question = questions[curQuestionIndex]
		themeContainer.dataset.questionId = question.id
		headerText.textContent = curQuestionIndex + 1
		headerPoints.textContent = question.Costs
		
		toPage('lead-theme')
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
			const questionId = +target.closest('.lead-theme__container').dataset.questionId

			ws.send(JSON.stringify({
				action: 'answer_question',
				data: {
					game: localStorage.getItem('session_id'),
					status: 'failed',
					id: questionId
				}
			}))
			ws.send(JSON.stringify({
				action: 'get_themes',
				data: localStorage.getItem('session_id')
			}))
		} else if (target.classList.contains('lead-theme__apply-btn')) {
			const questionId = +target.closest('.lead-theme__container').dataset.questionId

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

	const deleteGameBtn = document.querySelector('.lead-themes__delte-btn')
	deleteGameBtn.addEventListener('click', function() {
		ws.send(JSON.stringify({
			action: 'delete_game',
			data: localStorage.getItem('session_id')
		}))
	})
}


export default interfacePage