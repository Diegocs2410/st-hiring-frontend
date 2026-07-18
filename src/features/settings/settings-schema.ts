import * as Yup from 'yup'
import { Currency } from '../../types'

export const settingsSchema = Yup.object({
	siteName: Yup.string().trim().required('Site name is required'),
	supportEmail: Yup.string()
		.trim()
		.email('Enter a valid email')
		.required('Support email is required'),
	defaultCurrency: Yup.mixed<Currency>()
		.oneOf(['USD', 'EUR', 'GBP'])
		.required('Currency is required'),
	timezone: Yup.string().trim().required('Timezone is required'),
	enableEmailNotifications: Yup.boolean().required(),
	maxTicketsPerOrder: Yup.number()
		.transform((_value, originalValue) =>
			originalValue === '' || originalValue === null ? undefined : Number(originalValue),
		)
		.typeError('Must be a number')
		.integer('Must be a whole number')
		.min(1, 'Must be at least 1')
		.required('Max tickets per order is required'),
	paymentMethods: Yup.object({
		cash: Yup.boolean().required(),
		creditCard: Yup.boolean().required(),
		comp: Yup.boolean().required(),
	}).required(),
	ticketDisplay: Yup.object({
		showAvailableCount: Yup.boolean().required(),
		showSoldOut: Yup.boolean().required(),
	}).required(),
})
