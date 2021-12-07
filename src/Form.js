import { useState, useEffect, useMemo } from 'react';

import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import { ReactComponent as Logo } from './images/logo.svg';

const LOCAL_API_PATH = process.env.REACT_APP_LOCAL_API_PATH;

const activeStyle = {
	borderColor: '#2196f3',
};

const acceptStyle = {
	borderColor: '#00e676',
};

const rejectStyle = {
	borderColor: '#ff1744',
};

const thumbsContainer = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginTop: 16,
};

const thumb = {
	display: 'inline-flex',
	borderRadius: 2,
	border: '1px solid #eaeaea',
	marginBottom: 8,
	marginRight: 8,
	width: 'fit-content',
	height: 100,
	padding: 4,
	boxSizing: 'border-box',
};

const thumbInner = {
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
};

const img = {
	display: 'block',
	width: 'auto',
	height: '100%',
};

const Form = () => {
	const [values, setValues] = useState({
		ticketOpener: '',
		ticketSubject: '',
		ticketCompany: '',
		ticketEmail: '',
		ticketUrgentLvl: '',
		ticketFullExplanation: '',
	});

	const [loader, setLoader] = useState(false);
	const [submit, setSubmit] = useState(false);
	const [files, setFiles] = useState([]);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		accept: 'image/*',
		onDrop: (acceptedFiles) => {
			setFiles(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					}),
				),
			);
		},
	});

	const style = useMemo(
		() => ({
			...(isDragActive ? activeStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isDragActive, isDragReject, isDragAccept],
	);

	const thumbs = files.map((file) => (
		<div style={thumb} key={file.name}>
			<div style={thumbInner}>
				<img src={file.preview} style={img} alt={file.name} />
			</div>
		</div>
	));

	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[files],
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoader(true);

		const obj = JSON.stringify({
			name: `פנייה חדשה מאת - ${values.ticketOpener}`,
			description: `${values.ticketSubject}`,
			notify_all: true,
			parent: null,
			links_to: null,
			check_required_custom_fields: true,
			custom_fields: [
				{
					id: '5ae84966-e5da-4385-8fcc-84e93056d383',
					value: parseInt(values.ticketUrgentLvl),
				},
				{
					id: '7a379b9d-ccc4-4ed0-8d6d-88d9a7c030d9',
					value: `${values.ticketOpener}`,
				},
				{
					id: 'c81dc653-3462-4290-9517-4acb1b3c3e3d',
					value: `${values.ticketFullExplanation}`,
				},
				{
					id: 'e015f1ba-2b28-46b1-9e20-d3606d372b09',
					value: `${values.ticketCompany}`,
				},
				{
					id: 'c4f379ac-8921-43e8-a53b-c9c9552080eb',
					value: `${values.ticketEmail}`,
				},
			],
		});

		const formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append(files[i].name, files[i]);
		}
		formData.append('document', obj);

		axios({
			method: 'post',
			url: `${LOCAL_API_PATH}`,
			headers: { 'content-type': 'multipart/form-data' },
			data: formData,
		})
			.then((result) => {
				setSubmit(true);
				setLoader(false);
			})
			.catch((error) => console.log(error));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		name === 'ticketUrgentLvl'
			? setValues({ ...values, [name]: parseInt(value) })
			: setValues({ ...values, [name]: value });
	};

	if (submit) {
		return (
			<div className='form-container success'>
				<h3 className='sent-title'>
					{process.env.REACT_APP_THANKYOU_TITLE}
				</h3>
				<p>{process.env.REACT_APP_THANKYOU_TEXT}</p>
			</div>
		);
	}

	return (
		<>
			<Logo />
			<h1>טופס פתיחת קריאת שירות</h1>
			<h3>אנא מלאו את פרטי הקריאה באופן ברור ככל הניתן</h3>
			<form onSubmit={handleSubmit} encType='multipart/form-data'>
				<label htmlFor='ticketOpener'>
					{process.env.REACT_APP_TICKET_OPENER_LABEL}
				</label>
				<input
					id='ticketOpener'
					name='ticketOpener'
					type='text'
					onChange={handleChange}
					value={values.ticketOpener}
					placeholder={
						process.env.REACT_APP_TICKET_OPENER_PLACEHOLDER
					}
					required
				/>
				<label htmlFor='ticketCompany'>
					{process.env.REACT_APP_TICKET_COMPANY_LABEL}
				</label>
				<input
					id='ticketCompany'
					name='ticketCompany'
					type='text'
					onChange={handleChange}
					value={values.ticketCompany}
					placeholder={
						process.env.REACT_APP_TICKET_COMPANY_PLACEHOLDER
					}
					required
				/>
				<label htmlFor='ticketEmail'>
					{process.env.REACT_APP_TICKET_EMAIL_LABEL}
				</label>
				<input
					id='ticketEmail'
					name='ticketEmail'
					type='text'
					onChange={handleChange}
					value={values.ticketEmail}
					placeholder={process.env.REACT_APP_TICKET_EMAIL_PLACEHOLDER}
				/>
				<label htmlFor='ticketSubject'>
					{process.env.REACT_APP_TICKET_SUBJECT_LABEL}
				</label>
				<input
					id='ticketSubject'
					name='ticketSubject'
					type='text'
					onChange={handleChange}
					value={values.ticketSubject}
					placeholder={
						process.env.REACT_APP_TICKET_SUBJECT_PLACEHOLDER
					}
					required
				/>
				<label htmlFor='ticketUrgentLvl'>
					{process.env.REACT_APP_TICKET_URGENTLVL_LABEL}
				</label>
				<select
					name='ticketUrgentLvl'
					value={values.ticketUrgentLvl}
					onChange={handleChange}
					required
				>
					<option value='' label='--' />
					<option
						value='0'
						label={process.env.REACT_APP_TICKET_URGENTLVL_OPTION1}
					/>
					<option
						value='1'
						label={process.env.REACT_APP_TICKET_URGENTLVL_OPTION2}
					/>
					<option
						value='2'
						label={process.env.REACT_APP_TICKET_URGENTLVL_OPTION3}
					/>
					<option
						value='3'
						label={process.env.REACT_APP_TICKET_URGENTLVL_OPTION4}
					/>
					<option
						value='4'
						label={process.env.REACT_APP_TICKET_URGENTLVL_OPTION5}
					/>
				</select>
				<label htmlFor='ticketFullExplanation'>
					{process.env.REACT_APP_TICKET_FULL_EXPLANATION_LABEL}
				</label>
				<input
					id='ticketFullExplanation'
					name='ticketFullExplanation'
					type='text'
					onChange={handleChange}
					value={values.ticketFullExplanation}
					placeholder={
						process.env
							.REACT_APP_TICKET_FULL_EXPLANATION_PLACEHOLDER
					}
					required
				/>
				<div
					{...getRootProps({
						className: 'dropzone',
						multiple: true,
						style,
					})}
				>
					<input {...getInputProps()} />
					<p>{process.env.REACT_APP_FILES_UPLOAD_TEXT}</p>
				</div>
				<aside style={thumbsContainer}>{thumbs}</aside>

				<div className='center-content'>
					{!loader && (
						<button type='submit' className='submit-btn'>
							{process.env.REACT_APP_SUBMIT_BUTTON_TEXT}
						</button>
					)}

					{loader && (
						<Loader
							type='Puff'
							color='#00BFFF'
							height={50}
							width={50}
						/>
					)}
				</div>
			</form>
		</>
	);
};

export default Form;
