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
        client.onopen = () => {
			setConnect('OnLine');
          };
          client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            const stateToChange = {};
            if (dataFromServer.type === "userevent") {
              stateToChange.currentUsers = Object.values(dataFromServer.data.users);
            } else if (dataFromServer.type === "contentchange") {
              stateToChange.text = dataFromServer.data.editorContent || contentDefaultMessage;
            }
            stateToChange.userActivity = dataFromServer.data.userActivity;
          };
        
    });

	const handleChange = (e) => {
		setValue(e.target.value);
		if(e.type === "keydown") {
            if(e.keyCode !== 13) return;
            e.preventDefault();
        }

		setMsn([...e.target.value]);
		console.log('Enter');
	};

	const classes = useStyles();
    return <form className={classes.root} fullWidth noValidate autoComplete="off">
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
				onKeyDown={handleChange}
				variant="outlined"
			/>
		</div>
		<MsnList data={msn}/>
	</form>;
};

export default Index;