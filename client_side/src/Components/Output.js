import React from 'react';
import "./style.css";

function Output(props) {
    return (
        <div>
            <textarea 
                id='output' 
                value= {props.serverResponse}
                rows='10' 
                cols='100'
            />
        </div>
    )
}

export default Output;