module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#00FF00',
					secondary: '#f6d860',
					accent: '#37cdbe',
					neutral: '#3d4451',
					'base-100': '#ffffff'
				}
			},
			'dark'
		]
	}
};
