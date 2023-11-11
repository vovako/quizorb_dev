import { toPage, ws, getState, hearbeat } from "./functions.js"

function viewPage(pages) {
	const URLparams = new URLSearchParams(location.search)
	const state = getState()
	const store = {
		id: URLparams.get('id'),
		password: state.password,
		role: URLparams.get('role')
	}
	const loading = document.querySelector('.loading')
	const answerPopup = document.querySelector('.answer.popup')

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
	ws.onclose = function() {
		console.log("Соединение закрыто")
	}

	ws.onmessage = function (evt) {

		const msg = JSON.parse(evt.data)
		console.log(msg);

		switch (msg.action) {
			case 'connect':
				updateThemes(msg.data.Themes)
				toPage(pages.themes)
				loading.classList.remove('active')
				break;

			case 'select_theme':
				updateTheme(msg.data.Questions)
				toPage(pages.theme)
				updateThemeImageHeight()
				answerPopup.querySelector('.answer__text').textContent = msg.data.Answer
				answerPopup.querySelector('.answer__image img').src = msg.data.IMGAnswer
				break;

			case 'answer_question':
				updateTheme(msg.data.Questions)
				break;
			case 'get_themes':
				updateThemes(msg.data.Themes)
				break;
			case 'to-tiles':
				answerPopup.classList.remove('active')
				toPage(pages.themes)
				break;
			case 'restart_game':
				sessionStorage.setItem(msg.data, sessionStorage.getItem(store.id))
				sessionStorage.removeItem(store.id)
				URLparams.set('id', msg.data)
				history.pushState(null, null, '?' + URLparams.toString());
				location.reload()
				break;
			case 'question_trash':
				if (Object.keys(msg.data).length < 1) break;

				updateTheme([msg.data.Question])
				toPage(pages.theme)
				answerPopup.querySelector('.answer__text').textContent = msg.data.Answer
				answerPopup.querySelector('.answer__image img').src = msg.data.Question.url_answer
				break;
			case 'answer_question_trash':
				updateTheme(msg.data.Questions)
				break;
		}
	}
	function updateThemes(themes) {
		const themesBox = document.querySelector('.themes__container')
		themesBox.innerHTML = ''
		themes.forEach(theme => {
			themesBox.insertAdjacentHTML('beforeend', `
			<div class="themes-item ${theme.Status}" data-theme-id="${theme.id}">
				<div class="themes-item__text">${theme.Title}</div>
			</div>
			`)
		})
	}

	function updateTheme(questions) {

		const isSolved = questions.findIndex(q => q.Status === 'solved') !== -1
		if (isSolved || questions.findIndex(q => q.Status === '') == -1) {
			const answerPopup = document.querySelector('.answer.popup')
			answerPopup.classList.add('active')

			if (isSolved) {
				const pointsEl = document.querySelector('.answer__points-anim')
				const pointsCount = questions[questions.findIndex(q => q.Status === 'solved')].Costs
				pointsEl.textContent = pointsCount
				pointsEl.classList.add('active')
				setTimeout(() => {
					pointsEl.classList.remove('active')
				}, 1000)
			}
			return
		}

		questions.sort((a, b) => b.Costs - a.Costs)

		const themeImage = document.querySelector('.theme-body__image')
		const themeQuestionText = document.querySelector('.theme-body__text')

		let curQuesetionIndex = null
		for (let i = 0; i < questions.length; i++) {
			if (questions[i].Status === '') {
				curQuesetionIndex = i
				break;
			}
		}
		themeQuestionText.textContent = questions[curQuesetionIndex].question
		themeImage.src = questions[curQuesetionIndex].url_answer

		const themeBox = document.querySelector('.theme__list')
		let activeFinded = false
		themeBox.innerHTML = ''
		questions.forEach((question, i) => {

			themeBox.insertAdjacentHTML('beforeend', `
				<div class="theme-item ${question.Status} ${!activeFinded && question.Status !== 'failed' ? 'active' : ''}">
					<div class="theme-item__text">Вопрос ${i + 1}</div>
					<div class="theme-item__reward"><span>${question.Costs}</span> баллов</div>
				</div>
			`)
			if (!activeFinded && question.Status !== 'failed') activeFinded = true
		})
	}


	function updateThemeImageHeight() {
		const themeContainer = document.querySelector('.theme__container')
		const themeBody = themeContainer.querySelector('.theme-body')
		const text = themeBody.querySelector('.theme-body__text')
		const image = themeBody.querySelector('.theme-body__image')
		const maxImageHeight = themeContainer.clientHeight - (getComputedStyle(themeBody).padding.replace('px', '') * 2) - text.clientHeight + 'px'
		image.style.maxHeight = maxImageHeight
	}
}

export default viewPage