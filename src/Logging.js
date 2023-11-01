import './App.css';
import passportInstance from './connectPassport.js';

function Logging() {
    window.addEventListener('load', function() {
        passportInstance.loginCallback();
    });
    <div className="App">
          <header className='header'>
          <h1 className='headerText'>Chain Match Game - (Memory Matching)</h1>
          <h3></h3>
        </header>
    </div>

}


export default Logging;