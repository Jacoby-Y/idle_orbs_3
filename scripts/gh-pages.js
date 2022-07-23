import { publish } from 'gh-pages';

publish(
  'dist',
	{
		branch: 'gh-pages',
		repo: 'https://github.com/Jacoby-Y/idle_orbs_3.git',
		user: {
			name: 'Jacoby-Y',
			email: 'cobyyliniemi@gmail.com'
		}
	},
	() => {
		console.log('Deploy Complete!')
	}
)