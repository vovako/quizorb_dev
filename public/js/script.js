import { toPage } from "./functions.js"
import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'
const wsOrigin1 = 'wss://game-zmark.p.tnnl.in'
const wsOrigin2 = 'ws://localhost:8080'
const wsOrigin3 = 'ws://192.168.147.66'
const ws = new WebSocket(`${wsOrigin3}/websocket/connection`)

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

window.addEventListener('popstate', function() {
	if (confirm('Выйти в меню игр?')) {
		history.pushState(null, null, '')
		location.reload()
	}
})

switch (role) {
	case null:
		// получение игр
		toPage(pages.login)
		loading.classList.remove('active')
		// =============

		// определение роли
		const leadLoginBtn = document.querySelector('.login .lead')
		leadLoginBtn.addEventListener('click', function () {
			params.set('role', 'lead');
			history.pushState(null, null, '?' + params.toString());
			location.reload()
		})

		const viewLoginBtn = document.querySelector('.login .view')
		viewLoginBtn.addEventListener('click', function () {
			params.set('role', 'view');
			history.pushState(null, null, '?' + params.toString());
			location.reload()
		})

		break
	case 'lead':
		interfacePage(ws, pages.lead)
		break
	case 'view':
		viewPage(ws, pages.view)
		break
}

