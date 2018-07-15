import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const {ipcRenderer} = window.require('electron')
ipcRenderer.on('log-message', (event, args) => {
    console.log('%c[MAIN PROCESS]', 'font-weight: bold; color: limegreen; background-color: black;', ...args)
})

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
 