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
			case 'tiles':
				toPage('tiles')
				updateTiles(msg.data)
				break;
			case 'question':
				toPage('question')
				updateQuestion(msg.data)
				break;
			case 'answer':
				updateAnswer(msg.data)
				break;
		}
	}

	// window.addEventListener('message', function (evt) {
	// 	const msg = JSON.parse(evt.data)
	// 	console.log(msg);

	// 	switch (msg.msg) {
	// 		case 'start':
	// 			toPage('tiles')
	// 			const tilesBox = document.querySelector('.tiles__container')
	// 			for (let i = 1; i <= msg.data; i++) {
	// 				tilesBox.insertAdjacentHTML('beforeend', `<div class="tiles-item">${i}</div>`)
	// 			}
	// 			break;
	// 		case 'tiles':
	// 			toPage('tiles')
	// 			updateTiles(msg.data)
	// 			break;
	// 		case 'question':
	// 			toPage('question')
	// 			updateQuestion(msg.data)
	// 			break;
	// 		case 'answer':
	// 			updateAnswer(msg.data)
	// 			break;
	// 	}
	// })

	function updateTiles(data) {
		const tiles = document.querySelectorAll('.tiles-item')
		data.forEach((solved, i) => {
			if (solved) {
				tiles[i].classList.add('checked')
			}
		});
	}
	function updateQuestion(data) {
		const qTextEl = document.querySelector('.question__text')
		const qImgEl = document.querySelector('.question__image img')

		qTextEl.textContent = data.Question
		qImgEl.src = data.IMGQuestion !== '' ? data.IMGQuestion : 'img/temp/img.svg'
	}
	function updateAnswer(data) {
		const qTextEl = document.querySelector('.question__text')
		const qImgEl = document.querySelector('.question__image img')

		qTextEl.textContent = data.Answer
		qImgEl.src = data.IMGAnswer !== '' ? data.IMGAnswer : 'img/temp/img.svg'
	}
}

export default viewPage