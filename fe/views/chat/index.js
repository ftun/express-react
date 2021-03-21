import React, { useState, useEffect, Fragment, useRef, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import Messages from './Messages';
import io from 'socket.io-client';

const Index = props => {
    const [username, setUsername] = useState((new Date()).getTime());
    const [connect, setConnect] = useState(false);
    const [body, setBody] = useState('');
    const [data, setData] = useState({});
    const socket = useRef(null);

    /* Context de la session */
    const AuthConsumer = useContext(AuthContext);

	useEffect(() => {
        socket.current = io('http://localhost:9000');
		socket.current.on('chat', msn => {
            console.log('chat::on', msn);
            setData(msn)
        });
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
            console.log('chat::emit', msn);
            socket.current.emit('chat', msn);
            setBody('');
            // setData(msn);
        }
    }

    return <div className="columns">
        <div className="column is-one-quarter">On Line</div>
        <div className="column">
            <Messages data={data}/>
            <article className="media">
                <div className="media-content">
                    <form onSubmit={handelOnSubmit}>
                        <div className="field is-grouped">
                            <p className="control is-expanded">
                                <input
                                    className="input is-primary"
                                    placeholder="Add a message..."
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                />
                            </p>
                            <p className="control">
                                <button className="button is-primary is-light" type="submit" disabled={!AuthConsumer.existSession}>
                                    <span className="icon"><i className="fas fa-paper-plane"></i></span>
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </article>
        </div>
    </div>;
};

export default Index;
