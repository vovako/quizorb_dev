import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'

switch (location.pathname) {
	case '/':
	case '/index.html':
		interfacePage()
		break
	case '/view.html':
		viewPage()
		break
}


