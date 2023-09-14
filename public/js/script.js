import interfacePage from './interfacePage.js'
import viewPage from './interfacePage.js'

switch (location.hostname) {
	case '/': 
	case 'index.html':
		interfacePage()
		break
	case 'view.html':
		viewPage()
		break
}