import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#0b3d5c',
		},
		secondary: {
			main: '#c45c26',
		},
		background: {
			default: '#f5f7fa',
			paper: '#ffffff',
		},
	},
	typography: {
		fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
		h4: {
			fontWeight: 700,
		},
		h5: {
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 10,
	},
})
