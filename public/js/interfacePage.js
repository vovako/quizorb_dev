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

				updateTiles(msg.data.Questions)

				toPage('tiles')

				loading.classList.remove('active')
				break;

			case 'select_question':
				localStorage.setItem('state', JSON.stringify(state))
				toPage('members')
				break;

			case 'answer_question':
				updateTiles(msg.data.Questions)
				break;

			case 'to-tiles':
				toPage('tiles')
				break;
		}
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
		}
	})
}

export default interfacePage