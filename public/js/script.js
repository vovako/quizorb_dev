import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'
const wsOrigin1 = 'wss://game-zmark.p.tnnl.in'
const wsOrigin2 = 'ws://localhost:8080'
const ws = new WebSocket(`${wsOrigin1}/websocket/connection`)

switch (location.pathname) {
	case '/':
	case '/index.html':
		interfacePage(ws)
		break
	case '/view.html':
		viewPage(ws)
		break
}
