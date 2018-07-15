import React, { Component } from 'react';

/**
 * <ReadingPane mailMessage={mailMessage} />
 */
export default class ReadingPane extends Component {
    render() {
        if (this.props.mailMessage) return this.renderMessage()
        return this.renderNoMessage()
    }
    renderNoMessage = ()=>(
        <div className="mx-auto" style={{width: '100%'}}>
            No message is selected
        </div>
    )
    renderMessage = ()=>(
        <div>
        </div>
    )
}