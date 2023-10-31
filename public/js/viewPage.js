import { toPage } from "./functions.js"

function viewPage(ws, pages) {

	const loading = document.querySelector('.loading')

	ws.onopen = function () {
		console.log("Соединение удалось")

		if (localStorage.getItem('session_id')) {
			ws.send(JSON.stringify({
				"action": "reconnect",
				"data": {
					"role": "Viewer",
					"game": localStorage.getItem('session_id')
				}
			}))
		}
	}

	ws.onmessage = function (evt) {

		const msg = JSON.parse(evt.data)
		const answerPopup = document.querySelector('.answer.popup')

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
				updateThemes(msg.data.Themes)
				toPage(pages.themes)
				break;

			case 'select_theme':
				updateTheme(msg.data.Questions)
				toPage(pages.theme)

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
				localStorage.setItem('session_id', msg.data)
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

		const themeBox = document.querySelector('.theme__list')
		let activeFinded = false
		themeBox.innerHTML = ''
		questions.forEach((question, i) => {

			themeBox.insertAdjacentHTML('beforeend', `
				<div class="theme-item ${question.Status} ${!activeFinded && question.Status !== 'failed' ? 'active' : ''}">
					<div class="theme-item__text">Вопрос ${i + 1}</div>
					<div class="theme-item__reward"><span>${question.Costs}</span> баллов</div>
					<div class="theme-item__question ${activeFinded ? '' : 'active'}">${question.question}</div>
				</div>
			`)
			if (!activeFinded && question.Status !== 'failed') activeFinded = true
		})
	}
}

export default viewPage