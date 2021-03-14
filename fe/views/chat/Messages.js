import React, { Fragment } from 'react';

const Messages = ({ data = [] }) => {

    return <Fragment>
        {data.map((row, idx) => {
            return <article className="media" key={idx}>
                <figure className="media-left">
                    <p className="image is-64x64">
                        <img src="https://bulma.io/images/placeholders/128x128.png" />
                    </p>
                </figure>
                <div className="media-content">
                    <div className="content">
                        <p>
                            <strong>{row.username}</strong>
                            <br />
                            {row.body}
                            <br />
                            <small><a>Like</a> · <a>Reply</a> · {row.date}</small>
                        </p>
                    </div>
                </div>
            </article>
        })}
    </Fragment>;
};

export default Messages;
