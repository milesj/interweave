export default {
	setupFilesAfterEnv: ['jest-rut'],
	testEnvironment: 'jsdom',
	fakeTimers: {
		legacyFakeTimers: true,
	},
};
