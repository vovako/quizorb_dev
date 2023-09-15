import { toPage } from "./functions.js"

const MEMBERS = [
	{
		name: 'Сергей',
		surname: 'Никитин',
		id: 1,
		points: 0
	},
	{
		name: 'Виктор',
		surname: 'Бубылда',
		id: 2,
		points: 0
	},
	{
		name: 'Добрыня',
		surname: 'Горыныч',
		id: 3,
		points: 0
	},
]

function interfacePage() {
	const openMembersBtn = document.querySelector('.intro-members__open-btn')
	openMembersBtn.addEventListener('click', function (evt) {
		const mainBlock = openMembersBtn.parentElement
		if (!mainBlock.classList.contains('active')) {
			openMemberPanel()
		} else if (evt.target === openMembersBtn.querySelector('img')) {
			mainBlock.style.bottom = null
			mainBlock.classList.remove('active')
		}
	})
	function openMemberPanel() {
		const mainBlock = openMembersBtn.parentElement
		const wrapper = openMembersBtn.nextElementSibling
		mainBlock.style.bottom = wrapper.clientHeight + 'px'
		mainBlock.classList.add('active')
	}

	const addMemberBtn = document.querySelector('.intro-members__add-member-block button')
	addMemberBtn.addEventListener('click', function () {
		const addMemberBlock = addMemberBtn.closest('.intro-members__add-member-block')
		const surname = addMemberBlock.querySelector('[name="surname"]')
		const name = addMemberBlock.querySelector('[name="name"]')
		addMemberBlock.insertAdjacentHTML('afterend', `
	<div class="intro-members-item">
		<div class="intro-members-item__surname">${surname.value}</div>
		<div class="intro-members-item__name">${name.value}</div>
	</div>
	`)
		surname.value = ''
		name.value = ''
		updateMembersCount()
		openMemberPanel()
	})

	function updateMembersCount() {
		const membersCountEl = document.querySelector('.intro-members__open-btn span')
		const membersCount = document.querySelectorAll('.intro-members-item').length
		membersCountEl.textContent = membersCount
	}

	const beginGameBtn = document.querySelector('.intro__begin-quiz-btn')
	beginGameBtn.addEventListener('click', function () {
		const members = []
		const membersItems = document.querySelectorAll('.intro-members-item')
		membersItems.forEach(member => {
			members.push({
				surname: member.querySelector('.intro-members-item__surname').textContent,
				name: member.querySelector('.intro-members-item__name').textContent
			})
		});
		toPage('tiles')
		console.log(members);
	})

	function membersReset() {
		document.querySelector('.members__to-tiles').classList.remove('active')
		const membersBox = document.querySelector('.members__list')
		membersBox.classList.remove('lock')
		membersBox.innerHTML = ''

		MEMBERS.forEach(member => {
			membersBox.insertAdjacentHTML('beforeend', `
			<div class="members-item" data-member-id="${member.id}">
				<div class="members-item__name">${member.surname} ${member.name}</div>
				<button class="members-item__deny-btn">Неправильно</button>
				<button class="members-item__apply-btn">Правильно</button>
				<div class="members-item__points">${member.points}</div>
			</div>
			`)
		})
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

			const members = document.querySelectorAll('.members-item')
			if (members.length === [...members].filter(m => m.classList.contains('disabled')).length) {
				document.querySelector('.members__to-tiles').classList.add('active')
			}

		} else if (target.classList.contains('members-item__apply-btn')) {
			const item = target.closest('.members-item')
			item.classList.remove('active')
			item.classList.add('solved')
			const pointsEl = item.querySelector('.members-item__points')
			pointsEl.textContent = ++pointsEl.textContent
			target.closest('.members__list').classList.add('lock')
			document.querySelector('.members__to-tiles').classList.add('active')
		} else if (target.hasAttribute('data-page-target')) {
			toPage(target.dataset.pageTarget)
		} else if (target.classList.contains('tiles-item') && !target.classList.contains('checked')) {
			membersReset()
			toPage('members')
		}
	})

}

export default interfacePage