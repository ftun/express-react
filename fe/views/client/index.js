import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import MsnList from './MsnList';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
	  '& .MuiTextField-root': {
		margin: theme.spacing(1),
		// width: '25ch',
	  },
	},
  }));


const client = new W3CWebSocket('ws://localhost:9000');
const contentDefaultMessage = "Start writing your document here";

const Index = () => {
	const [connect, setConnect] = React.useState('offline');
	const [user, setUser] = React.useState('');
	const [value, setValue] = React.useState('');
	const [msn, setMsn] = React.useState([]);

    // De forma similar a componentDidMount y componentDidUpdate
    useEffect(() => {
		client.onerror = function() {
			setConnect('Connection Error');
		};

        client.onopen = () => {
			setConnect('OnLine');
			// function sendNumber() {
		    //     if (client.readyState === client.OPEN) {
		    //         var number = Math.round(Math.random() * 0xFFFFFF);
		    //         client.send(number.toString());
		    //         setTimeout(sendNumber, 1000);
		    //     }
		    // }
		    // sendNumber();
		}

		client.onclose = function() {
		    console.log('echo-protocol Client Closed');
		};

		client.onmessage = function(e) {
		    if (typeof e.data === 'string') {
		        console.log("Received: '" + e.data + "'");
		    }
		};

    });

	const handleOnKeyDown = (e) => {
		if (e.key === 'Enter' && value.trim() !== '') {
			e.preventDefault();
			setMsn([...msn, e.target.value]);
			setValue('');
			client.send(JSON.stringify({
	           msn : e.target.value,
	          type: "userevent"
	        }));
		}
	};

	const getSession = () => {
		return <form className={classes.root} noValidate autoComplete="off">
					<div>
						<TextField required id="standard-required" label="Required" defaultValue="" />
							<Button variant="contained" color="primary">
					        	Ok!
					      	</Button>
					</div>
    			</form>
	};

	const classes = useStyles();
	// if (user == '') return getSession();
    return <form className={classes.root} noValidate autoComplete="off">
		<div>{connect}</div>
		<div>
			<InputLabel htmlFor="outlined-adornment-amount">Messages</InputLabel>
			<TextField
				id="outlined-multiline-flexible"
				label="Multiline"
				multiline
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
