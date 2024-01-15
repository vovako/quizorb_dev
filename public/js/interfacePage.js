import { toPage, ws, getState, setState, hearbeat, exitGame, exitAndDeleteGame, toLoginPage, waitForImageLoad } from "./functions.js"

function interfacePage(pages) {
	const URLparams = new URLSearchParams(location.search)
	const state = getState()
	if (state === null) toLoginPage();

	const store = {
		id: URLparams.get('id'),
		password: state.password,
		role: URLparams.get('role'),
	}

	const loading = document.querySelector('.loading')

	const applyAnswerBtn = document.querySelector('.lead-theme__apply-btn')
	applyAnswerBtn.addEventListener('click', function () {
		const questionId = +pages.theme.querySelector('.container').dataset.questionId

		if (pages.theme.classList.contains('trash')) {
			ws.send(JSON.stringify({
				"action": "answer_question_trash",
				"data": {
					"game": store.id,
					"question": questionId,
					Status: 'solved'
				}
			}))
			// pages.theme.classList.remove('trash')
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
	})


	const denyAnswerBtn = document.querySelector('.lead-theme__deny-btn')
	denyAnswerBtn.addEventListener('click', function () {
		const questionId = +pages.theme.querySelector('.container').dataset.questionId

		if (pages.theme.classList.contains('trash')) {
			ws.send(JSON.stringify({
				"action": "answer_question_trash",
				"data": {
					"game": store.id,
					"question": questionId,
					Status: 'failed'
				}
			}))
			pages.theme.classList.remove('trash')
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
	})

	const menuButtons = document.querySelectorAll('.menu-btn')
	const menuPanel = document.querySelector('.lead-menu')
	menuButtons.forEach(btn => {
		btn.addEventListener('click', function () {
			toggleMenu()
		})
	})

	menuPanel.addEventListener('click', function (evt) {
		if (evt.target !== menuPanel) return

		toggleMenu(false)
	})

	const twoTourBtn = document.querySelector('.lead-themes__two-tour-btn')
	twoTourBtn.addEventListener('click', function () {
		if (twoTourBtn.classList.contains('disabled')) return;

		ws.send(JSON.stringify({
			action: 'question_trash',
			data: store.id
		}))
	})

	const toThemesBtn = document.querySelector('.lead-theme__to-tiles-btn')
	toThemesBtn.addEventListener('click', function () {
		ws.send(JSON.stringify({
			action: 'to-tiles',
			data: store.id
		}))
	})

	const exitGameBtn = document.querySelector('.exit-game-btn')
	exitGameBtn.addEventListener('click', function () {
		exitGame()
	})

	const exitAndDeleteGameBtn = document.querySelector('.leave-and-delete-game-btn')
	exitAndDeleteGameBtn.addEventListener('click', function () {
		exitAndDeleteGame(store.id)
	})

	const restartGameBtn = document.querySelector('.lead-themes__restart-game-btn')
	restartGameBtn.addEventListener('click', function () {
		ws.send(JSON.stringify({
			action: 'restart_game',
			data: store.id
		}))
	})

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

		hearbeat()
	}
	ws.onclose = function () {
		console.log("Соединение закрыто")
	}

	ws.onmessage = function (evt) {

		const msg = JSON.parse(evt.data)
		console.log(msg);

		switch (msg.action) {
			case 'connect':
				if (msg.error !== null) {
					toLoginPage()
				}
				updateTrashCount(msg.data.TrashCount)
				updateThemes(msg.data.Themes)

				if (state.page === null || state.page === pages.themes.dataset.page) {
					toPage(pages.themes)
				} else if (state.page === pages.theme.dataset.page) {
					ws.send(JSON.stringify({
						"action": "select_theme",
						"data": {
							"game": store.id,
							"theme": state.theme
						}
					}))
					toPage(pages.theme)

				} else if (state.page === pages.toThemesBtn.dataset.page) {
					toPage(pages.toThemesBtn)
				}
				loading.classList.remove('active')
				break;

			case 'select_theme':
				updateTheme(msg.data.Questions)
				const answerEl = document.querySelector('.lead-theme__answer span')
				answerEl.textContent = msg.data.Answer
				break;

			case 'get_themes':
				updateThemes(msg.data.Themes)
				break;

			case 'answer_question':
				updateTrashCount(msg.data.TrashCount)
				updateTheme(msg.data.Questions)
				break;

			case 'restart_game':
				state.page = null
				setState(state)

				sessionStorage.setItem(msg.data, sessionStorage.getItem(store.id))
				sessionStorage.removeItem(store.id)

				URLparams.set('id', msg.data)
				history.pushState(null, null, '?' + URLparams.toString());
				location.reload()
				break;

			case 'question_trash':
				if (msg.error) return;

				updateTheme([msg.data.Question])
				document.querySelector('.lead-theme').classList.add('trash')
				toggleMenu(false)
				break;

			case 'to-tiles':
				toPage(pages.themes, state)
				break;

			case 'answer_question_trash':

				updateTrashCount(-1)
				updateThemeStatistic(msg.data.Questions)

				toPage(pages.toThemesBtn, state)
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

		const leftThemesEl = document.querySelector('.lead-navbar__left-questions span')
		leftThemesEl.textContent = themes.filter(t => t.Status === '').length
	}

	function updateTheme(questions) {

		const themeContainer = document.querySelector('.lead-theme__container')
		const headerText = themeContainer.querySelector('.lead-theme__text')
		const headerPoints = themeContainer.querySelector('.lead-theme__points span')
		const headerQuestion = themeContainer.querySelector('.lead-theme__question')
		const headerQuestionImg = themeContainer.querySelector('.lead-theme__question-image img')

		if (questions.findIndex(q => q.Status === 'solved') !== -1 || questions.findIndex(q => q.Status === '') == -1) {
			updateThemeStatistic(questions)

			toPage(pages.toThemesBtn, state)
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

		waitForImageLoad(headerQuestionImg).then(() => {
			toPage(pages.theme, state)
		})
	}

	function updateThemeStatistic(questions) {
		const pointsEl = document.querySelector('.to-themes-btn__points-count')
		const solvedEl = document.querySelector('.to-themes-btn__true-answers-count')
		const failedEl = document.querySelector('.to-themes-btn__false-answers-count')
		const twoTourQuestionCountEl = document.querySelector('.to-themes-btn__two-tour-addit')

		const pointsCount = questions.filter(q => q.Status === 'solved')[0]?.Costs ?? 0;
		const solvedCount = questions.filter(q => q.Status === 'solved').length
		const failedCount = questions.filter(q => q.Status === 'failed').length
		const twoTourQuestionsCount = questions.filter(q => q.Status === '').length

		const isTrash = pages.theme.classList.contains('trash')

		pointsEl.textContent = pointsCount
		solvedEl.textContent = solvedCount
		failedEl.textContent = failedCount
		twoTourQuestionCountEl.textContent = isTrash ? 0 : twoTourQuestionsCount

		if (isTrash) {
			pages.theme.classList.remove('trash')
		}
	}

	function updateTrashCount(count) {
		const trashQuestionsBtn = document.querySelector('.lead-themes__two-tour-btn')
		const trashQuestionsCountEl = trashQuestionsBtn.querySelector('span')
		

		if (count === -1) {
			trashQuestionsCountEl.textContent = --trashQuestionsCountEl.textContent
			// if (+trashQuestionsCountEl.textContent <= 0) trashQuestionsCountEl.classList.add('disabled')
		} else {
			trashQuestionsCountEl.textContent = count;
		}
		+trashQuestionsCountEl.textContent === 0 ? trashQuestionsCountEl.parentElement.classList.add('disabled') : trashQuestionsCountEl.parentElement.classList.remove('disabled')

	}

	function toggleMenu(state = null) {
		if (state === null) {
			[...menuButtons].map(b => b.classList.toggle('active'))
			menuPanel.classList.toggle('active')
		} else if (state === false) {
			[...menuButtons].map(b => b.classList.remove('active'))
			menuPanel.classList.remove('active')
		} else if (state === true) {
			[...menuButtons].map(b => b.classList.add('active'))
			menuPanel.classList.add('active')
		}
	}

	document.addEventListener('click', function (evt) {
		const target = evt.target
		// console.log(target);

		if (target.classList.contains('lead-themes-item')) {
			state.theme = +target.dataset.themeId
			setState(state)
			ws.send(JSON.stringify({
				action: 'select_theme',
				data: {
					game: store.id,
					theme: state.theme
				}
			}))

		}
	})
}


export default interfacePage