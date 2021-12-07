import React from 'react';
import ReactDOM from 'react-dom';
import './Form.css';
import './scss/main.scss';
import App from './App';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

ReactDOM.render(
	<GoogleReCaptchaProvider
		reCaptchaKey={process.env.REACT_APP_RECAPTCHA_V3_PUB_KEY}
	>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</GoogleReCaptchaProvider>,
	document.getElementById('root'),
);
