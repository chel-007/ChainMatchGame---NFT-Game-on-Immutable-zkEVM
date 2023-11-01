import './App.css';

function Logout() {
    return (
        <div className="App">
          <header>
          <h1>Immutable Passport Login (Sample App)</h1>
          <h2>You Have Successfully, <p 
          style={{color: 'yellow', display: 'inline', fontStyle: 'oblique'}}>logged out</p> From the App</h2>
        </header>

        <div>

        <button className='buttonCont'
              onClick={ async () => { 
                window.location.href = 'https://chel-chainmatchgame.netlify.app/'
                
              }}

              
        >Go Home Here</button>


        </div>
      </div>
    );
  }

  export default Logout