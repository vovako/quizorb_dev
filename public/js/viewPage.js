import { toPage } from "./functions.js"

async function viewPage(ws) {


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
		console.log(msg);

		switch (msg.action) {
			case 'game':
				localStorage.setItem('session_id', msg.data.ID)

			case 'reconnect':
				if (msg.error) {
					localStorage.clear()
					location.reload()
				}

				const tilesBox = document.querySelector('.tiles__container')
				const questions = msg.data.Questions
				questions.forEach((q, i) => {
					tilesBox.insertAdjacentHTML('beforeend', `<div class="tiles-item ${q.Solved ? 'checked' : ''}">${i + 1}</div>`)
				})
				toPage('tiles')
				break;

			case 'select_question':
				updateQuestion(msg.data.Question)
				updateAnswer(msg.data.Question)
				toPage('question')
				break;

			case 'answer_question':
				
				toPage('answer')
				break;

			case 'to-tiles':
				toPage('tiles')
				break;
		}
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