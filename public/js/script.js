import { toPage } from "./functions.js"
import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'
const wsOrigin1 = 'wss://game-zmark.p.tnnl.in'
const wsOrigin2 = 'ws://localhost:8080'
const wsOrigin3 = 'ws://192.168.147.66'
const wsOrigin4 = 'wss://izumra.ru'
const ws = new WebSocket(`${wsOrigin4}/websocket/connection`)

const loading = document.querySelector('.loading')
const pages = {
	login: document.querySelector('[data-page="login"]'),
	lead: {
		themes: document.querySelector('[data-page="lead-themes"]'),
		theme: document.querySelector('[data-page="lead-theme"]'),
		toThemesBtn: document.querySelector('[data-page="to-themes-btn"]'),
	},
	view: {
		themes: document.querySelector('[data-page="themes"]'),
		theme: document.querySelector('[data-page="theme"]'),
	}
}

const params = new URLSearchParams(window.location.search);
const role = params.get('role')
switch (role) {
	case null:
		// получение игр
		toPage(pages.login)
		loading.classList.remove('active')
		// =============

		//добавление игры
		const openPopupAddGameBtn = document.querySelector('.login__add-game-btn')
		const addGamePopup = document.querySelector('.create-game-popup')
		openPopupAddGameBtn.addEventListener('click', function() {
			addGamePopup.classList.add('active')
		})

		const addGamePopup_closeBtn = addGamePopup.querySelector('.cancel-btn')
		addGamePopup_closeBtn.addEventListener('click', function() {
			addGamePopup.classList.remove('active')
		})

		//вход в игру
		const loginPopup = document.querySelector('.login-popup')
		const loginPopup_closeBtn = loginPopup.querySelector('.cancel-btn')
		loginPopup_closeBtn.addEventListener('click', function () {
			loginPopup.classList.remove('active')
		})

		// определение роли
		const roleSwitcher = loginPopup.querySelector('#role-switcher')
		const loginBtn = loginPopup.querySelector('.login-btn')
		loginBtn.addEventListener('click', function() {
			if (roleSwitcher.checked) {
				//view
				params.set('role', 'view');
				history.pushState(null, null, '?' + params.toString());
			} else {
				//lead
				params.set('role', 'lead');
				history.pushState(null, null, '?' + params.toString());
			}
			location.reload()
		})

		document.addEventListener('click', function(evt) {
			const target = evt.target
			if (target.classList.contains('login-game')) {
				loginPopup.classList.add('active')
			}
		})

		break
	case 'lead':
		interfacePage(ws, pages.lead)
		break
	case 'view':
		viewPage(ws, pages.view)
		break
}

window.addEventListener('popstate', function () {
	if (confirm('Выйти в меню игр?')) {
		history.pushState(null, null, '')
		location.reload()
	}
})