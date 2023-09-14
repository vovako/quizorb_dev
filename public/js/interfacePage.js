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

		console.log(members);
	})
}

export default interfacePage