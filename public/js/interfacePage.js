import { toPage } from "./functions.js"

let curQuestionIndex = null

function interfacePage(ws) {

	// localStorage.clear()//_temp_
	const state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : { members: [] }

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
				break;

			case 'select_question':
				state.members = msg.data.Players
				localStorage.setItem('state', JSON.stringify(state))
				membersReset()
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


	// if (state.members.length) {
	// 	updateIntroMembersList()
	// }

	// viewWin.onload = function () {
	// 	const msg = {
	// 		msg: 'start',
	// 		data: QUESTIONS.length
	// 	}
	// 	viewWin.postMessage(JSON.stringify(msg), location.origin)
	// }

	const openMembersBtn = document.querySelector('.intro-members__open-btn')
	openMembersBtn.addEventListener('click', function (evt) {
		const mainBlock = openMembersBtn.parentElement
		if (!mainBlock.classList.contains('active')) {
			updateHeightIntroMembersList()
		} else if (evt.target === openMembersBtn.querySelector('img')) {
			mainBlock.style.bottom = null
			mainBlock.classList.remove('active')
		}
	})

	const addMemberBtn = document.querySelector('.intro-members__add-member-block button')
	addMemberBtn.addEventListener('click', function () {
		const addMemberBlock = addMemberBtn.closest('.intro-members__add-member-block')
		const surname = addMemberBlock.querySelector('[name="surname"]')
		const name = addMemberBlock.querySelector('[name="name"]')

		state.members.push({
			name: name.value,
			surname: surname.value,
			id: state.members.length
		})

		updateIntroMembersList()

		surname.value = ''
		name.value = ''
	})

	const beginGameBtn = document.querySelector('.intro__begin-quiz-btn')
	beginGameBtn.addEventListener('click', function () {

		if (state.members.length) {
			ws.send(JSON.stringify({
				action: 'game',
				data: state.members
			}))
		} else {
			const membersOpenBtn = document.querySelector('.intro-members__open-btn')
			membersOpenBtn.classList.remove('empty-list')
			setTimeout(() => {
				membersOpenBtn.classList.add('empty-list')
			})
		}
	})


	function updateIntroMembersList() {
		const addMemberBlock = document.querySelector('.intro-members__add-member-block')
		const membersCountEl = document.querySelector('.intro-members__open-btn span')
		while (addMemberBlock.nextElementSibling) {
			addMemberBlock.nextElementSibling?.remove()
		}

		state.members.forEach(member => {
			addMemberBlock.insertAdjacentHTML('afterend', `
			<div class="intro-members-item" data-member-id="${member.id}">
				<div class="intro-members-item__surname">${member.surname}</div>
				<div class="intro-members-item__name">${member.name}</div>
				<button class="intro-members-item__delete-btn">Удалить</button>
			</div>
			`)
		})
		updateHeightIntroMembersList()

		membersCountEl.textContent = state.members.length

		localStorage.setItem('state', JSON.stringify(state))
	}

	function updateHeightIntroMembersList() {
		const introMembersEl = document.querySelector('.intro-members')
		const wrapper = introMembersEl.querySelector('.intro-members__wrapper')
		introMembersEl.style.bottom = wrapper.clientHeight + 'px'
		introMembersEl.classList.add('active')
	}

	function membersReset() {
		const membersBox = document.querySelector('.members__list')
		membersBox.classList.remove('lock')
		membersBox.innerHTML = ''

		state.members.forEach(member => {
			membersBox.insertAdjacentHTML('beforeend', `
			<div class="members-item" data-member-id="${member.id}">
			<div class="members-item__points">${member.Score}</div>
				<div class="members-item__name">${member.surname} ${member.name}</div>
				<button class="members-item__deny-btn">Неправильно</button>
				<button class="members-item__apply-btn">Правильно</button>
			</div>
			`)
		})
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

		if (target.classList.contains('members-item') && !target.classList.contains('active') && !target.classList.contains('disabled') && !target.classList.contains('solved') && !target.closest('.members__list.lock')) {
			document.querySelector('.members-item.active')?.classList.remove('active')
			target.classList.add('active')
		} else if (target.classList.contains('members-item__deny-btn')) {
			const item = target.closest('.members-item')
			item.classList.remove('active')
			item.classList.add('disabled')
		} else if (target.classList.contains('members-item__apply-btn')) {
			const item = target.closest('.members-item')
			item.classList.remove('active')
			item.classList.add('solved')

			const memberId = +item.dataset.memberId
			const member = state.members.filter(m => m.id === memberId)[0]
			member.points++//

			const pointsEl = item.querySelector('.members-item__points')
			pointsEl.textContent = member.points
			target.closest('.members__list').classList.add('lock')

			document.querySelector(`[data-tiles-id="${curQuestionIndex}"]`).classList.add('checked')

			const andwers = [{
				id_player: memberId,
				right: true
			}]
			document.querySelectorAll('.members-item.disabled').forEach(m => {
				andwers.push({
					id_player: +m.dataset.memberId,
					right: false
				})
			})

			ws.send(JSON.stringify({
				"action": "answer_question",
				"data": {
					"question": curQuestionIndex,
					"game": localStorage.getItem('session_id'),
					"value": 200,
					"answers": andwers
				}
			}))
		} else if (target.hasAttribute('data-page-target')) {
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
		} else if (target.classList.contains('intro-members-item__delete-btn')) {
			const memberId = +target.closest('.intro-members-item').dataset.memberId
			const memberIndex = state.members.findIndex(m => m.id === memberId)
			state.members.splice(memberIndex, 1)
			updateIntroMembersList()
		}
	})
}

export default interfacePage