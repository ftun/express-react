import React, { useState, useEffect, useRef } from 'react';

const Messages = ({ data = {} }) => {
    const [messages, setMessages] = useState([]);
    const widthDivMessages = Math.ceil(window.innerWidth / 3);
    let myDiv = useRef(null);

    // Al obtener un nuevo mensaje
    useEffect(() => {
        if (Object.keys(data).length) setMessages([...messages, data]);
    }, [data]);

    // Cada que se agrega unn mensaje se mueve el scroll al final para la visibilidad del mismo
    useEffect(() => {
        myDiv.scrollTop = myDiv.scrollHeight;
    }, [messages])

    return <div ref={r => myDiv = r} style={{ height: widthDivMessages, overflowY: 'scroll' }} id="your_div" >
        {messages.map((row, idx) => {
            return <article className="media" key={idx}>
                <figure className="media-left image is-48x48">
                    <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" />
                </figure>
                <div className="media-content">
                    <div className="content">
                        <p><strong>{row.username}</strong>&nbsp;{row.body}<br /></p>
                    </div>
                    <nav className="level is-mobile">
                        <div className="level-left">
                            <a className="level-item" aria-label="reply">
                                <span className="icon is-small"><i className="fas fa-reply" aria-hidden="true"></i></span>
                            </a>
                            <a className="level-item" aria-label="retweet">
                                <span className="icon is-small"><i className="fas fa-retweet" aria-hidden="true"></i></span>
                            </a>
                            <a className="level-item" aria-label="like">
                                <span className="icon is-small"><i className="fas fa-heart" aria-hidden="true"></i></span>
                            </a>
                        </div>
                    </nav>
                </div>
            </article>
        })}
    </div>;
};

export default Messages;
