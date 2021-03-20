import React, { useState, useEffect, Fragment, useRef, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import Messages from './Messages';
import io from 'socket.io-client';

const Index = props => {
    const [username, setUsername] = useState((new Date()).getTime());
    const [connect, setConnect] = React.useState(false);
    const [body, setBody] = React.useState('');
    const [data, setData] = React.useState({});
    const socket = useRef(null);

    /* Context de la session */
    const AuthConsumer = useContext(AuthContext);

	useEffect(() => {

        socket.current = io('http://localhost:9000');
		socket.current.on('chat', msn => setData(msn));

        return () => {
            socket.current.off('chat', msn => {
                setData({
                    username : username,
                    body : '',
                    type: "EXITED"
                });
            });
		    socket.current.close()
        };

    }, []);

    const handelOnSubmit = e => {
        e.preventDefault();
        if (body.trim() !== '' && socket.current) {
            let msn = {
                username : username,
                body : body,
                type: "MSN"
            };
            socket.current.emit('chat', msn);
            setBody('');
            setData(msn);
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
