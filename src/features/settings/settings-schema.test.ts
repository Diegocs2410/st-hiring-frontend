import { describe, expect, it } from 'vitest'
import { settingsSchema } from './settings-schema'

const validSettings = {
	siteName: 'See Tickets',
	supportEmail: 'support@seetickets.com',
	defaultCurrency: 'USD',
	timezone: 'UTC',
	enableEmailNotifications: true,
	maxTicketsPerOrder: 10,
	paymentMethods: {
		cash: true,
		creditCard: true,
		comp: false,
	},
	ticketDisplay: {
		showAvailableCount: true,
		showSoldOut: true,
	},
}

describe('settingsSchema', () => {
	it('accepts a valid settings payload', async () => {
		await expect(settingsSchema.validate(validSettings)).resolves.toMatchObject(
			validSettings,
		)
	})

	it('rejects an invalid support email', async () => {
		await expect(
			settingsSchema.validate({
				...validSettings,
				supportEmail: 'not-an-email',
			}),
		).rejects.toThrow('Enter a valid email')
	})

	it('rejects maxTicketsPerOrder below 1', async () => {
		await expect(
			settingsSchema.validate({
				...validSettings,
				maxTicketsPerOrder: 0,
			}),
		).rejects.toThrow('Must be at least 1')
	})
})
