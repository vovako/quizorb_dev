import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'

const ws = new WebSocket('wss://game-zmark.p.tnnl.in/websocket/connection')

switch (location.pathname) {
	case '/':
	case '/index.html':
		interfacePage(ws)
		break
	case '/view.html':
		viewPage(ws)
		break
}
