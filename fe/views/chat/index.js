import React, { useState, useEffect, Fragment } from 'react';
import Messages from './Messages';

import { w3cwebsocket as W3CWebSocket } from "websocket";
// import Axios from '../../../helpers/axios';

const client = new W3CWebSocket('ws://localhost:9000');

const Index = props => {
    const [username, setUsername] = useState(new Date());
    const [connect, setConnect] = React.useState('offline');
    const [body, setBody] = React.useState('');
    const [data, setData] = React.useState([]);

	useEffect(() => {
		client.onerror = () => setConnect('Connection Error');
		client.onopen = () => {
            // setConnect('OnLine')
            let date = new Date();
            client.send(JSON.stringify({
            	username : username,
              	body : '',
              	type: "JOIN"
            }));
        };
		client.onclose = () => console.log('echo-protocol Client Closed');
		client.onmessage = e => {
		    if (typeof e.data === 'string') {
				let msnS = JSON.parse(e.data);
				setData([...data, msnS]);
		    }
		};
	});

    const handelOnSubmit = e => {
        e.preventDefault();
        if (body.trim() !== '') {
            client.send(JSON.stringify({
            	username : username,
              	body : body,
              	type: "MSN"
            }));
            setBody('');
        }
    }

    return <Fragment>
        <Messages data={data}/>
        <article className="media">
            <figure className="media-left">
                <p className="image is-64x64">
                    <img src="https://bulma.io/images/placeholders/128x128.png" />
                </p>
            </figure>
            <div className="media-content">
                <form onSubmit={handelOnSubmit}>
                    <div className="field">
                        <p className="control">
                            <textarea
                                className="textarea is-primary"
                                placeholder="Add a message..."
                                value={body}
                                onChange={e => setBody(e.target.value)}
                            >
                            </textarea>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control">
                            <button className="button is-primary is-light" type="submit">Post message</button>
                        </p>
                    </div>
                </form>
            </div>
        </article>
    </Fragment>;
};

export default Index;
