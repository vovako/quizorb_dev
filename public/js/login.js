import { toPage, ws } from "./functions.js"

function loginPage(pages) {
	const loading = document.querySelector('.loading')
	const createGamePopup = pages.login.querySelector('.create-game-popup')
	const loginPopup = pages.login.querySelector('.login-popup')
	const store = {
		role: null,
		password: null,
		id: null
	}

	ws.onopen = function () {
		console.log("Соединение удалось")

		ws.send(JSON.stringify({
			"action": "games"
		}))
	}

	ws.onmessage = function (evt) {

		const msg = JSON.parse(evt.data)

		console.log(msg);

		switch (msg.action) {
			case 'games':
				const games = msg.data

				if (games?.length > 0) {
					const gamesBoxEl = pages.login.querySelector('.login__games')
					gamesBoxEl.innerHTML = ''
					games.forEach(game => {
						gamesBoxEl.insertAdjacentHTML('beforeend', `
						<button class="login-game" data-game-id="${game.id}">
							<div class="login-game__title">${game.title}</div>
							<div class="login-game__role login-game-role">
								<div class="login-game-role__image">
									<img src="img/lead.svg" alt="">
								</div>
								<img src="img/${game.lead ? 'check-mark' : 'cross'}.svg" alt="" class="login-game-role__status">
							</div>
							<div class="login-game__role login-game-role">
								<div class="login-game-role__image">
									<img src="img/view.svg" alt="">
								</div>
								<img src="img/${game.viewer ? 'check-mark' : 'cross'}.svg" alt="" class="login-game-role__status">
							</div>
						</button>
						`)
					});

					const titleInput = pages.login.querySelector('.create-game-popup [name="title"]')
					titleInput.value = `Игра ${games.length + 1}`
				}

				toPage(pages.login)
				loading.classList.remove('active')

				break

			case 'game':
				if (msg.data === 'Игра создана') {
					createGamePopup.classList.remove('active')

					ws.send(JSON.stringify({
						"action": "games"
					}))
				}
				break

			case 'connect':
				
				if (msg.error === null) {
					const URLparams = new URLSearchParams(location.search);
					URLparams.set('role', store.role)
					URLparams.set('id', store.id)
					sessionStorage.setItem(store.id, store.password)
					history.pushState(null, null, '?' + URLparams.toString());
					location.reload()
				}
				break
		}
	}



	//добавление игры
	const openPopupAddGameBtn = document.querySelector('.login__add-game-btn')
	openPopupAddGameBtn.addEventListener('click', function () {
		createGamePopup.classList.add('active')
	})

	const createGamePopup_closeBtn = createGamePopup.querySelector('.cancel-btn')
	createGamePopup_closeBtn.addEventListener('click', function () {
		createGamePopup.classList.remove('active')
	})

	const createGamePopup_createBtn = createGamePopup.querySelector('.create-btn')
	createGamePopup_createBtn.addEventListener('click', function () {
		const title = createGamePopup.querySelector('input[name="title"]').value
		const password = createGamePopup.querySelector('input[name="password"]').value

		ws.send(JSON.stringify({
			action: 'game',
			data: {
				title: title.trim(),
				password: password.trim()
			}
		}))
	})

	//вход в игру
	const loginPopup_closeBtn = loginPopup.querySelector('.cancel-btn')
	loginPopup_closeBtn.addEventListener('click', function () {
		loginPopup.classList.remove('active')
	})

	// определение роли
	const roleSwitcher = loginPopup.querySelector('#role-switcher')
	const loginBtn = loginPopup.querySelector('.login-btn')
	loginBtn.addEventListener('click', function () {
		store.role = roleSwitcher.checked ? 'Viewer' : 'Lead'
		store.password = loginPopup.querySelector('input[name="password"]').value.trim()
		ws.send(JSON.stringify({
			"action": "connect",
			"data": {
				game: store.id,
				role: store.role,
				password: store.password
			}
		}))
	})

	document.addEventListener('click', function (evt) {
		const target = evt.target
		if (target.classList.contains('login-game')) {
			store.id = target.dataset.gameId
			loginPopup.querySelector('.login-popup__title').textContent = target.querySelector('.login-game__title').textContent
			loginPopup.classList.add('active')
		}
	})
}

export default loginPage