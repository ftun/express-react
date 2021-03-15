import React, { useState, useEffect, Fragment, useRef, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import Messages from './Messages';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const Index = props => {
    const [username, setUsername] = useState(new Date());
    const [connect, setConnect] = React.useState(false);
    const [body, setBody] = React.useState('');
    const [data, setData] = React.useState([]);
    const ws = useRef(null);

    /* Context de la session */
    const AuthConsumer = useContext(AuthContext);

	useEffect(() => {
        ws.current = new W3CWebSocket('ws://localhost:9000');
		ws.current.onerror = () => console.error('Connection Error');
		// ws.current.onerror = () => setConnect('Connection Error');
		ws.current.onopen = () => {
            ws.current.send(JSON.stringify({
                username : username,
                body : '',
                type: "JOIN"
            }));
        };

        return () => {
            ws.current.onclose = () => console.log('echo-protocol Client Closed');
       };

   }, []);

    useEffect(() => {
        let isMounted = true;
        if (!ws.current) return;
        ws.current.onmessage = e => {
		    if (typeof e.data === 'string') {
				let msnS = JSON.parse(e.data);
				if (isMounted) setData([...data, msnS]);
		    }
		};

        return () => isMounted = false;
    });

    const handelOnSubmit = e => {
        e.preventDefault();
        if (body.trim() !== '') {
            ws.current.send(JSON.stringify({
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
                            <button className="button is-primary is-light" type="submit" disabled={!AuthConsumer.existSession}>Post message</button>
                        </p>
                    </div>
                </form>
            </div>
        </article>
    </Fragment>;
};

export default Index;
