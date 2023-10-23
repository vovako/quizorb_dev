import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'
const wsOrigin1 = 'wss://game-zmark.p.tnnl.in'
const wsOrigin2 = 'ws://localhost:8080'
const wsOrigin3='ws://192.168.147.66'
const ws = new WebSocket(`${wsOrigin3}/websocket/connection`)

switch (location.pathname) {
	case '/':
	case '/index.html':
		interfacePage(ws)
		break
	case '/view.html':
		viewPage(ws)
		break
}
