import { toPage, ws, getState, setState, hearbeat } from "./functions.js"



function interfacePage(pages) {
	const URLparams = new URLSearchParams(location.search)
	const state = getState()
	const store = {
		id: URLparams.get('id'),
		password: state.password,
		role: URLparams.get('role'),
	}

	const loading = document.querySelector('.loading')
	let curQuestionIndex = null


	ws.onopen = function () {
		console.log("Соединение удалось")

		ws.send(JSON.stringify({
			"action": "connect",
			"data": {
				"game": store.id,
				"role": store.role,
				"password": store.password
			}
		}))

		hearbeat(ws)
	}
	ws.onclose = function () {
		console.log("Соединение закрыто")
	}

	ws.onmessage = function (evt) {

		const msg = JSON.parse(evt.data)
		console.log(msg);

		switch (msg.action) {
			case 'connect':
				updateThemes(msg.data.Themes)
				if (state.page === null) {
					toPage(pages.themes)
					state.page = 'themes'
					setState(state)
				} else if (state.page === 'themes') {
					toPage(pages.themes)
				} else if (state.page === 'theme') {
					ws.send(JSON.stringify({
						"action": "select_theme",
						"data": {
							"game": store.id,
							"theme": state.theme
						}
					}))
					toPage(pages.theme)
				} else if (state.page === 'to-themes-btn') {
					toPage(pages.toThemesBtn)
				}
				loading.classList.remove('active')
				break;
			case 'select_theme':
				updateTheme(msg.data.Questions)
				const answerEl = document.querySelector('.lead-theme__answer')
				answerEl.textContent = msg.data.Answer
				break;
			case 'get_themes':
				updateThemes(msg.data.Themes)
				break;
			case 'answer_question':
				updateTheme(msg.data.Questions)
				break;

			case 'restart_game':
				sessionStorage.setItem(msg.data, sessionStorage.getItem(store.id))
				sessionStorage.removeItem(store.id)
				URLparams.set('id', msg.data)
				history.pushState(null, null, '?' + URLparams.toString());
				location.reload()
				break;
			case 'question_trash':
				if (msg.data) {
					updateTheme([msg.data.Question])
					document.querySelector('.lead-theme').classList.add('trash')
				} else {
					const questionTwoTourBtn = document.querySelector('.lead-themes__two-tour-btn')
					questionTwoTourBtn.classList.remove('anim')
					setTimeout(() => {
						questionTwoTourBtn.classList.add('anim')
					}, 10);
				}
				break;
			case 'to-tiles':
				toPage(pages.themes)
				state.page = 'themes'
				setState(state)
				break;
			case 'answer_question_trash':
				toPage(pages.toThemesBtn)
				state.page = 'to-themes-btn'
				setState(state)
				break;
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
		const headerQuestion = themeContainer.querySelector('.lead-theme__question')
		const headerQuestionImg = themeContainer.querySelector('.lead-theme__question-image img')

		if (questions.findIndex(q => q.Status === 'solved') !== -1 || questions.findIndex(q => q.Status === '') == -1) {
			toPage(pages.toThemesBtn)
			state.page = 'to-themes-btn'
			setState(state)
			return
		}

		questions.sort((a, b) => b.Costs - a.Costs)
		const curQuestionIndex = questions.findIndex(q => q.Status === '')

		const question = questions[curQuestionIndex]
		themeContainer.dataset.questionId = question.id
		headerText.textContent = curQuestionIndex + 1
		headerPoints.textContent = question.Costs
		headerQuestion.textContent = question.question
		headerQuestionImg.src = question.url_answer

		toPage(pages.theme)
		state.page = 'theme'
		setState(state)
	}

	document.addEventListener('click', function (evt) {
		const target = evt.target

		if (target.classList.contains('intro-tiles-item__apply-btn') && !target.classList.contains('checked')) {
			curQuestionIndex = +target.closest('.intro-tiles-item').dataset.tilesId

			ws.send(JSON.stringify({
				"action": "select_question",
				"data": {
					"question": curQuestionIndex,
					"game": store.id
				}
			}))
		} else if (target.classList.contains('members__back-btn')) {
			ws.send(JSON.stringify({
				action: "to-tiles",
				data: store.id
			}))

		} else if (target.classList.contains('lead-themes-item')) {
			state.theme = +target.dataset.themeId
			setState(state)
			ws.send(JSON.stringify({
				action: 'select_theme',
				data: {
					game: store.id,
					theme: state.theme
				}
			}))

			toPage(pages.theme)
			state.page = 'theme'
		} else if (target.classList.contains('lead-theme__deny-btn')) {
			const themeSection = target.closest('section.lead-theme')
			const questionId = +target.closest('.lead-theme__container').dataset.questionId

			if (themeSection.classList.contains('trash')) {
				ws.send(JSON.stringify({
					"action": "answer_question_trash",
					"data": {
						"game": store.id,
						"question": questionId,
						Status: 'failed'
					}
				}))
				themeSection.classList.remove('trash')
			} else {
				ws.send(JSON.stringify({
					action: 'answer_question',
					data: {
						game: store.id,
						status: 'failed',
						id: questionId
					}
				}))
			}


			ws.send(JSON.stringify({
				action: 'get_themes',
				data: store.id
			}))
		} else if (target.classList.contains('lead-theme__apply-btn')) {
			const themeSection = target.closest('section.lead-theme')
			const questionId = +target.closest('.lead-theme__container').dataset.questionId

			if (themeSection.classList.contains('trash')) {
				ws.send(JSON.stringify({
					"action": "answer_question_trash",
					"data": {
						"game": store.id,
						"question": questionId,
						Status: 'solved'
					}
				}))
				themeSection.classList.remove('trash')
			} else {
				ws.send(JSON.stringify({
					action: 'answer_question',
					data: {
						game: store.id,
						status: 'solved',
						id: questionId
					}
				}))
			}

			ws.send(JSON.stringify({
				action: 'get_themes',
				data: store.id
			}))

		} else if (target.classList.contains('to-themes-btn__btn')) {
			ws.send(JSON.stringify({
				action: 'to-tiles',
				data: store.id
			}))
			toPage(pages.themes)
			state.page = 'themes'
		} else if (target.classList.contains('lead-themes__two-tour-btn')) {
			ws.send(JSON.stringify({
				action: 'question_trash',
				data: store.id
			}))
		} else if (target.classList.contains('lead-theme__to-tiles-btn')) {
			ws.send(JSON.stringify({
				action: 'to-tiles',
				data: store.id
			}))
		}
	})

	const deleteGameBtn = document.querySelector('.lead-themes__delte-btn')
	deleteGameBtn.addEventListener('click', function () {
		ws.send(JSON.stringify({
			action: 'restart_game',
			data: store.id
		}))
	})
}


export default interfacePage