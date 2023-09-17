import { toPage } from "./functions.js"

async function viewPage() {

	window.addEventListener('message', function (evt) {
		const msg = JSON.parse(evt.data)

		switch (msg.msg) {
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
	})

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

	window.onbeforeunload = function () {
		return false
	}
}

export default viewPage