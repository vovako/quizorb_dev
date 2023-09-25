import { toPage } from "./functions.js"

async function viewPage(ws) {

	const tempStorage = {}

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

				updateThemes(msg.data.Themes)
				toPage('themes')
				break;

			case 'select_theme':
				updateTheme(msg.data.Questions)
				toPage('theme')

				const answerText = answerPopup.querySelector('.answer__text')
				const answerIMG = answerPopup.querySelector('.answer__image img')
				answerText.textContent = msg.data.Answer
				answerIMG.src = msg.data.IMGAnswer
				break;

			case 'answer_question':
				updateTheme(msg.data.Questions)
				break;

			case 'to-tiles':
				answerPopup.classList.remove('active')
				toPage('themes')
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

		if (questions.findIndex(q => q.Status === 'solved') !== -1) {
			const answerPopup = document.querySelector('.answer.popup')
			answerPopup.classList.add('active')
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
				</div>
			`)
			if (!activeFinded && question.Status !== 'failed') activeFinded = true
		})
	}

	function updateTiles(data) {
		const tiles = document.querySelectorAll('.tiles-item')
		data.forEach((solved, i) => {
			if (solved) {
				tiles[i].classList.add('checked')
			}
		});
	}

	function updateQuestion(data) {
		const questionPage = document.querySelector('[data-page="question"]')
		const qTextEl = questionPage.querySelector('.question__text')
		const qImgEl = questionPage.querySelector('.question__image img')

		qTextEl.textContent = data.question
		qImgEl.src = data.url_question !== '' ? data.url_question : 'img/temp/img.svg'
	}

	function updateAnswer(data) {
		const answerPage = document.querySelector('[data-page="answer"]')
		const qTextEl = answerPage.querySelector('.question__text')
		const qImgEl = answerPage.querySelector('.question__image img')

		qTextEl.textContent = data.answer
		qImgEl.src = data.url_answer !== '' ? data.url_answer : 'img/temp/img.svg'
	}
}

export default viewPage