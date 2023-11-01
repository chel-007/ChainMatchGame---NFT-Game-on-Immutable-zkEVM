
import './App.css';
import passportInstance from './connectPassport.js';
import React, { useState } from 'react';

function App() {
  const [isShown, setIsShown] = useState(false);
  const [loading, setLoading] = useState(false);  

  var output = window.localStorage.getItem("userWalletAddress");
  window.addEventListener('load', function() {
    if(output != null){
     window.location.href = 'https://chel-chainmatchgame.netlify.app/game'
    }
});
document.body.setAttribute('class', 'bodyHome');
  const handleClick = event => {
    setIsShown(current => !current);
  };
  return (
    
    <div className="cont">
      <header className="header">
        <h1 className='headerText'>Chain Match Game - Memory Match</h1>
      </header>
      <h3 className='introText'>Welcome, Player. This is a Web Game where you can match Similar Cards in a Grid, by remembering their exact Positions.
        You can Play across a Few Levels, each posing a New Challenge for your to Overcome!. Win NFTs on the Immutable Blockchain by completing each Level. </h3>


    <li className='buttonHolder'>
      <span>
      <button className='buttonCont'  onClick={handleClick}>How to Play?</button>
      {isShown && (
        <nav className='nav'>
          <p>There are 5 Levels in the Game</p>
          <p>Match all the Cards across each Level</p>
          <p>Win NFTs on completing a Game within the Countdown timer</p>
        </nav>
      )}
      </span>
  
      <span>
      <button className='buttonCont'
              onClick={ async () => {    
                      
             if(window)   {
                try {
               setLoading(true);
                  
                const provider = passportInstance.connectEvm();
                const accounts =  await provider.request({ method: "eth_requestAccounts" }).then((result) => result[0])

                window.localStorage.setItem("userWalletAddress", accounts);
                const userProfile = await passportInstance.getUserInfo().then((result) => result)
                window.localStorage.setItem("userProfileEmail", userProfile.email);

                setLoading(false);

                window.location.href = 'https://chel-chainmatchgame.netlify.app/game'
                } catch (error) {
                 setLoading(false);
                
                  alert('Popup unable to proceed');
                
                }
              }
               else{
                alert('please connect to the internet')
               } 
              
              }}
              >Login to Chain Match</button></span>
    
    </li> 
    <div 
    style={{display: loading ? "block" : "none"}}>
    <img style={{width: '110px', marginTop: '30px'}} src='/images/loading2.gif' />
    </div>
    </div>
  );
}

export default App;