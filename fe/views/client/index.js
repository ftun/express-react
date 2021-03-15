import React, { useState, useEffect, Fragment } from 'react';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import MsnList from './MsnList';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
//
// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		display: 'flex',
// 		flexWrap: 'wrap',
// 	},
// 	textField: {
// 		marginLeft: theme.spacing(1),
// 		marginRight: theme.spacing(1),
// 		width: '25ch',
// 	},
// }));

// const client = new W3CWebSocket('ws://localhost:9000');

const Index = () => {
	const [username, setUsername] = useState('');
	const [connect, setConnect] = React.useState('offline');
	const [body, setBody] = React.useState('');
	const [data, setData] = React.useState([]);

	// useEffect(() => {
	// 	client.onerror = () => setConnect('Connection Error');
	// 	client.onopen = () => setConnect('OnLine');
	// 	client.onclose = () => console.log('echo-protocol Client Closed');
	// 	client.onmessage = e => {
	// 	    if (typeof e.data === 'string') {
	// 			let msnS = JSON.parse(e.data);
	// 			setData([...data, msnS]);
	// 	    }
	// 	};
	// });

	/**
	* Se obtiene un usuarios para la sesion del socket
	* @param object DOM
	* @return mixed
	*/
	const handleGetUserName = e => {
		if (e.type === 'keydown') {
			if (e.key === 'Enter' && e.target.value.trim() !== '') {
				e.preventDefault();
				setUsername(e.target.value);
				// client.send(JSON.stringify({
				// 	username : e.target.value,
				//   	body : '',
				//   	type: "JOIN"
				// }));
			}
		}
	};

	/**
	* Funcion para el envio de mensajes
	* @param object DOM
	* @return mixed
	*/
	const handleSendMessage = e => {
		if (e.key === 'Enter' && body.trim() !== '') {
			e.preventDefault();
			console.log(body);
			setBody('');
			// client.send(JSON.stringify({
			// 	username : username,
			//   	body : e.target.value,
			//   	type: "MSN"
			// }));
		}
	};

	const handelOnSubmit = e => {
		e.preventDefault();
		console.log(e.target);
	}

	return <form onSubmit={handelOnSubmit}>
		<div className="field">
  			<label className="label">Message</label>
  			<div className="control">
    			<textarea className="textarea" name="body" placeholder="Textarea" onChange={e => setBody(e.target.value)}
			onKeyDown={handleSendMessage}></textarea>
  			</div>
		</div>
		<div className="field is-grouped">
			<div className="control">
		    	<button className="button is-link" type="submit">Submit</button>
		  	</div>
		  	<div className="control">
		    	<button className="button is-link is-light">Cancel</button>
		  	</div>
		</div>
	</form>

	// const classes = useStyles();
  	// return <Fragment>
	//  	<div className={classes.root}>
	// 		<div>{connect}</div>
	// 		<div>
	// 			<TextField
	// 				disabled={username !== ''}
	// 				id="outlined-margin-dense"
	//             	label="Username"
	//             	defaultValue=''
	//             	className={classes.textField}
	//             	helperText="Some important text"
	//             	margin="dense"
	//             	variant="outlined"
	// 				onKeyDown={handleGetUserName}
	// 				onChange={handleGetUserName}
	//           	/>
	//         	<TextField
	// 				disabled={username === ''}
	// 				id="outlined-full-width"
	// 				label="Label"
	// 				style={{ margin: 8 }}
	// 				placeholder="Placeholder"
	// 				helperText="Full width!"
	// 				fullWidth
	// 				margin="normal"
	// 				InputLabelProps={{
	// 					shrink: true,
	// 				}}
	// 				value={body}
	// 				variant="outlined"
	// 				onChange={e => setBody(e.target.value)}
	// 				onKeyDown={handleSendMessage}
	//         	/>
	//       	</div>
	//     </div>
	// 	<MsnList data={data}/>
	// </Fragment>
	// ;
};

export default Index;
