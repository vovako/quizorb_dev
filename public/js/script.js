import loginPage from "./login.js"
import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'
import {exitGame} from './functions.js'

const pages = {
	login: {
		login: document.querySelector('[data-page="login"]')
	},
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
const URLparams = new URLSearchParams(location.search);
const role = URLparams.get('role')
switch (role) {
	case null:
		loginPage(pages.login)
		break
	case 'Lead':
		interfacePage(pages.lead)
		document.body.classList.add('lead')
		break
	case 'Viewer':
		viewPage(pages.view)
		document.body.classList.add('view')
		break
}

window.addEventListener('popstate', exitGame)