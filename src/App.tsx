import { useEffect } from 'react'
import { AppLayout } from './components/app-layout'
import { useAppDispatch } from './store/hooks'
import { loadSettings } from './store/settings-slice'

function App () {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(loadSettings())
	}, [dispatch])

	return <AppLayout />
}

export default App
