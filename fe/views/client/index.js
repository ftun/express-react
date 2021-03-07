import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import MsnList from './MsnList';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
	  '& .MuiTextField-root': {
		margin: theme.spacing(1),
		width: '25ch',
	  },
	},
  }));


const client = new W3CWebSocket('ws://localhost:9000');
const contentDefaultMessage = "Start writing your document here";

const Index = () => {
	const [connect, setConnect] = React.useState('offline');
	const [value, setValue] = React.useState('');
	const [msn, setMsn] = React.useState([]);

    // De forma similar a componentDidMount y componentDidUpdate
    useEffect(() => {
        client.onopen = () => setConnect('OnLine');
        client.onmessage = message => {
			const dataFromServer = JSON.parse(message.data);
			const stateToChange = {};
			if (dataFromServer.type === "userevent") {
			stateToChange.currentUsers = Object.values(dataFromServer.data.users);
			} else if (dataFromServer.type === "contentchange") {
			stateToChange.text = dataFromServer.data.editorContent || contentDefaultMessage;
			}
			stateToChange.userActivity = dataFromServer.data.userActivity;
			console.log(stateToChange);
		};

    });

	const handleOnKeyDown = (e) => {
		if (e.key === 'Enter' && value.trim() !== '') {
			e.preventDefault();
			setMsn([...msn, e.target.value]);
			setValue('');
			client.send(JSON.stringify({
	          ...msn,
	          type: "userevent"
	        }));
		}
	};

	const classes = useStyles();
    return <form className={classes.root} noValidate autoComplete="off">
		<div>{connect}</div>
		<div>
			<InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
			<TextField
				id="outlined-multiline-flexible"
				label="Multiline"
				multiline
				rowsMax={4}
				rows={4}
				value={value}
          		onChange={e => setValue(e.target.value)}
				onKeyDown={handleOnKeyDown}
				variant="outlined"
			/>
		</div>
		<MsnList data={msn}/>
	</form>;
};

export default Index;
