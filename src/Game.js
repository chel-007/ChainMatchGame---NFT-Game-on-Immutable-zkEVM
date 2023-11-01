import React, { Component } from 'react';
import './Game.css';
import passportInstance from './connectPassport.js';
import { ethers } from 'ethers';
import { config, passport  } from '@imtbl/sdk';
import mintNFT from './mintNFT.ts';

var wallet = window.localStorage.getItem("userWalletAddress");

var email = window.localStorage.getItem("userProfileEmail");

class MemoryCardGame extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        levels: [
          { gridRows: 2, gridCols: 4, timer: 25 }, // Level 1
          { gridRows: 3, gridCols: 4, timer: 30 }, // Level 2
          { gridRows: 4, gridCols: 4, timer: 35 }, // Level 3
          { gridRows: 5, gridCols: 4, timer: 45 }, // Level 4
          { gridRows: 5, gridCols: 4, timer: 40 }, // Level 5
        ],
        currentLevel: 0,
        timeLeft: 0,
        flips: 0,
        matchedCard: 0,
        disableDeck: false,
        isPlaying: false,
        card1: null,
        card2: null,
        timer: null,
        cards: [],
        canMintNFT: false,
        mintedNFT: false,
        showNextLevelPopup: false,
        showWinPopup: false,
        showLosePopup: false,
      };
    }
  
    componentDidMount() {
      this.setNewLevel(0);
    }
  
    setNewLevel = (level) => {
        const { levels } = this.state;
        const cardData = this.generateCardData(levels[level]); // Generate card data for the level
        this.setState(
          {
            currentLevel: level,
            timeLeft: levels[level].timer,
            flips: 0,
            matchedCard: 0,
            card1: null,
            card2: null,
            timer: null,
            disableDeck: false,
            isPlaying: false,
            cards: cardData, // Set the generated card data in the state
            showNextLevelPopup: false,
            showWinPopup: false,
            showLosePopup: false,
          },
          () => this.shuffleCards()
        );
      };
      
  
    generateCardData = (level) => {
      const totalCards = level.gridRows * level.gridCols;
      const imageIndices = Array.from(
        { length: totalCards / 2 },
        (_, i) => [i + 1, i + 1]
      ).flat();
      const cardData = [];
      console.log(imageIndices)
  
      for (let i = 0; i < totalCards; i++) {
        const randomIndex = Math.floor(Math.random() * imageIndices.length);
        const imageIndex = imageIndices.splice(randomIndex, 1)[0];
        
        cardData.push({ id: i, imageIndex, isFlipped: false, isMatched: false });
        //console.log(totalCards)
      }
  
      return cardData;
    };
  
    shuffleCards = () => {
      const { cards } = this.state;
      const shuffledCards = [...cards];
      for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
      }
      this.setState({ cards: shuffledCards });
    };
  
    initialTimer = () => {
      const { timeLeft, timer } = this.state;
      if (timeLeft <= 0) {
        clearInterval(timer);
        this.setState({ showLosePopup: true });
      }
      this.setState((prevState) => ({ timeLeft: prevState.timeLeft - 1 }));
    };
  
    flipCard = ({ target }) => {
      const { card1, disableDeck, timeLeft, cards } = this.state;
  
      if (!this.state.isPlaying) {
        this.setState({ isPlaying: true, timer: setInterval(this.initialTimer, 1000) });
      }
  
      if (target !== card1 && !disableDeck && timeLeft > 0) {
        this.setState((prevState) => ({
          flips: prevState.flips + 1,
        }));
  
        const clickedCard = cards.find((c) => c.id === parseInt(target.dataset.id));
  
        if (!clickedCard.isFlipped) {
          clickedCard.isFlipped = true;
          this.setState({ cards }, () => {
            if (!this.state.card1) {
              this.setState({ card1: target });
            } else {
              this.setState({ card2: target, disableDeck: true }, () => {
                const card1Img = cards.find((c) => c.id === parseInt(this.state.card1.dataset.id)).imageIndex;
                const card2Img = cards.find((c) => c.id === parseInt(this.state.card2.dataset.id)).imageIndex;
                if (card1Img === card2Img) {
                  this.matchCard(card1Img, card2Img);
                } else {
                  setTimeout(() => {
                    this.resetIncorrectCards(); // Reset only incorrect cards
                  }, 1000);
                }
              });
            }
          });
        }
      }
    };

    matchCard = (img1, img2) => {
        
        if (img1 === img2) {
          this.setState((prevState) => ({
            matchedCard: prevState.matchedCard + 2,
          }));
  
          const { card1, card2, level } = this.state;
          const { matchedCard, cards } = this.state;
          console.log(this.state.matchedCard);
      
          // Mark the cards as matched
          const matchedCard1 = cards.find((card) => card.id === parseInt(card1.dataset.id));
          const matchedCard2 = cards.find((card) => card.id === parseInt(card2.dataset.id));
      
          matchedCard1.isMatched = true;
          matchedCard2.isMatched = true;
          
  
          this.setState({ cards });
    
          if (matchedCard + 2 === cards.length) {
          //  console.log('All cards matched, timeLeft:', timeLeft);
            clearInterval(this.state.timer);
            if (matchedCard + 2 === cards.length && this.currentLevel == 2) {
            this.setState({ canMintNFT: true })
            }
            if (this.state.currentLevel < this.state.levels.length - 1) {
              this.setState({ showNextLevelPopup: true });
            } else {
              this.setState({ showWinPopup: true });
            }
          }
    
          this.state.card1.removeEventListener('click', this.flipCard);
          this.state.card2.removeEventListener('click', this.flipCard);
          this.setState({ card1: null, card2: null, disableDeck: false });
        } else {
          setTimeout(() => {
            this.state.card1.classList.add('shake');
            this.state.card2.classList.add('shake');
          }, 400);
    
          setTimeout(() => {
            this.state.card1.classList.remove('shake', 'flip');
            this.state.card2.classList.remove('shake', 'flip');
            this.setState({ card1: null, card2: null, disableDeck: false });
          }, 1200);
        }
      };
  
      resetIncorrectCards = () => {
        const { cards, card1, card2 } = this.state;
        
        // Filter out the incorrect unmatched cards
        const incorrectUnmatchedCards = cards.filter(
          (card) => card.isFlipped && !card.isMatched
        );
        
        // Reset only the filtered incorrect cards
        incorrectUnmatchedCards.forEach((card) => {
          card.isFlipped = false;
        });
        
        // Reset the two flipped card slots
        this.setState({ cards, card1: null, card2: null, disableDeck: false });
      };
      
        
  
    // resetCards = () => {
    //   // Reset the two flipped cards
    //   this.setState({ card1: null, card2: null, disableDeck: false });
    //   this.resetFlippedCards();
    // };
  
    // resetFlippedCards = () => {
    //   // Reset all flipped cards in the state
    //   const { cards } = this.state;
    //   cards.forEach((card) => {
    //     if (card.isFlipped) {
    //       card.isFlipped = false;
    //     }
    //   });
    //   this.setState({ cards });
    // };
  
  
    renderCards = () => {
      const { cards } = this.state;
      return cards.map((card) => (
        <li
          key={card.id}
          className={`card ${card.isFlipped ? 'flip' : ''}`}
          data-id={card.id}
          onClick={this.flipCard}
        >
          <div className="view front-view">
            <img src="/images/que_icon.svg" alt="question-icon" />
          </div>
          <div className="view back-view">
            <img src={`/images/img-${card.imageIndex}.png`} alt="card-image" />
          </div>
        </li>
      ));
    };
  
    renderNextLevelPopup = () => {
      return (
        <div className="popup">
          <p>Congratulations! You've completed Level {this.state.currentLevel + 1}!</p>
          <button onClick={() => this.setNewLevel(this.state.currentLevel + 1)}>
            Next Level
          </button>
        </div>
      );
    };
  
    renderWinPopup = () => {
      // You can add a winning message and play winning music here
      return (
        <div className="popup">
          <p>Congratulations! You've completed all levels!</p>
        </div>
      );
    };
  
    renderLosePopup = () => {
      // You can add a losing message and play losing music here
      return (
        <div className="popup">
          <p>Time's up! You lost this level.</p>
          <button onClick={() => this.setNewLevel(this.state.currentLevel)}>Try Again</button>
        </div>
      );
    };

mintNFT = async () => {
const provider = passportInstance.connectEvm();
 // const signer = provider.getSigner();

const userAddress = '0x7448ECCBaA2299298d3B4148B52e91C55CDD9dE8'
const toAddress = {wallet};
const erc721ContractAddress = '0x7A6AAbd5cD770822287D2b46019Ef33c8A6d5aB3';
const tokenId = 2;

// Construct the contract interface using the ABI
const contract = new ethers.Contract(
  erc721ContractAddress,
//   [
//     function safeTransferFrom(address: from, address: to, uint256: tokenId),
//   ],
  
);

const tx = await contract.safeTransferFrom(
    userAddress,
    toAddress,
    tokenId,
  );
  
  // Wait for the transaction to complete
  await tx.wait();
  console.log(tx)
      };

    Logout = async () => {
        if(window)   {
            window.localStorage.removeItem("email");

            window.localStorage.removeItem("wallet");
            try {
                
              await passportInstance.logout();
            }
            catch (error) {
                alert('Popup unable to proceed');
            }
        }
        else{
            alert('please connect to the internet')
           }
    }
  
    render() {
        const { showNextLevelPopup, showWinPopup, showLosePopup, currentLevel, canMintNF } = this.state;
        const { mintedNFT } = this.state;
        document.body.setAttribute('class', 'bodyGame');
        
        return (
          <div className='gameView'>
            <p className='player'>Ready for the Challenge, {email}</p>
            <div className="wrapper">
              {showNextLevelPopup && (
                <div className="popup">
                  <p>Congratulations! You've completed this Level!</p>
                  {currentLevel < 4 ? ( // Display "Next Level" button for levels 1 to 4
                    <button onClick={() => this.setNewLevel(this.state.currentLevel + 1)}>Next Level</button>
                  ) : ( // Display "Mint NFT" button for level 5
                    <button onClick={mintNFT}>Redeem LVL {this.state.currentLevel + 1} NFT</button>
                  )}
                </div>
              )}
              {showWinPopup && this.renderWinPopup()}
              {showLosePopup && this.renderLosePopup()}
              Level {this.state.currentLevel + 1}
              <div className="cards">{this.renderCards()}</div>
              <div className="details">
                <p className="time">
                  Time: <span><b>{this.state.timeLeft}s</b></span>
                </p>
                <p className="flips">
                  Flips: <span><b>{this.state.flips}</b></span>
                </p>
              </div>
            </div>
               
            <div className='stackButton'>
              <button style={{color: 'red'}} className='gameButton' onClick={async () => { 
                window.location.href = 'http://localhost:3000/'
              }}>View your NFTs</button>
                
              <button className='gameButton' onClick={this.Logout}>Logout from ChainMatch</button>
            </div>
          </div>
        );
      }
      
      
  }
  
  export default MemoryCardGame;
  