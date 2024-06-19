import { useState, useEffect } from "react"
import Card from "./components/Card"
import Counter from "./components/Counter";


function App() {
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [pokemonList, setPokemonList] = useState([]);
  const [pastChoices, setPastChoices] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameState, setGameState] = useState('ongoing'); // won, lost


  useEffect(() => window.addEventListener("click", playAudio()), []);


  useEffect(() => {
    if (isGameStarted) { fetchInitialPokemon(); }
  }, [difficulty, isGameStarted]);



  async function fetchInitialPokemon() {
    setScore(0);
    setPastChoices([]);
    setGameState('ongoing');
    let numberOfPokemon;
    switch (difficulty) {
      case 'easy': numberOfPokemon = 4; break;
      case 'medium': numberOfPokemon = 7; break;
      case 'hard': numberOfPokemon = 14; break;
      default: numberOfPokemon = 3;
    }

    const pokemonArray = [];
    for (let i = 0; i < numberOfPokemon; i++) {
      pokemonArray.push(await fetchPokemon());
    }

    setPokemonList(pokemonArray);
  }

  async function fetchPokemon() {
    try {
      const totalPokemons = 1025;
      const randomID = Math.floor(1 + Math.random() * totalPokemons);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID}`)
      const pokeJSON = await response.json();
      return pokeJSON;
    }
    catch (error) {
      console.error("Error with your fetch operation");
    }
  }


  async function handleCardClick(pokemon) {
    if (!pastChoices.includes(pokemon.name)) {
      setScore(score + 1);
      if (score + 1 > maxScore) {
        setMaxScore(score + 1);
      }
      setPastChoices([...pastChoices, pokemon.name]);
      checkGameWon();
      shuffleCards();
    }
    else {
      console.log("Game over");
      setGameState('lost');
    }
  }

  function shuffleCards() {
    const shuffledPokemonList = pokemonList.slice().sort(() => Math.random() - 0.5);
    setPokemonList(shuffledPokemonList);
  }


  // Utilidades

  function resetGame() {
    setScore(0);
    setPastChoices([]);
    setGameState('ongoing');
    fetchInitialPokemon();

  }

  function checkGameWon() {
    if (pastChoices.length + 1 === pokemonList.length) {
      setGameState('won');
    }
  }



  function startGame() {
    setIsGameStarted(true);
  }


  function playAudio() {
    const audio = document.getElementById('audio')
    audio.play()
  }







  // HTML

  if (!isGameStarted) {
    return (
      <div className="main-screen">
        <audio id="audio" src="public/backgroundMusic.mp3" autoPlay loop></audio>

        <div className="difficulty-selector">
          Choose difficulty
          <button onClick={() => setDifficulty('easy')} className="difficulty-btn">{difficulty === 'easy' ? "> Easy" : "Easy"}</button>
          <button onClick={() => setDifficulty('medium')} className="difficulty-btn">{difficulty === 'medium' ? "> Medium" : "Medium"}</button>
          <button onClick={() => setDifficulty('hard')} className="difficulty-btn">{difficulty === 'hard' ? "> Hard" : "Hard"}</button>
          <button onClick={() => startGame()} className="start_btn">Start</button>
        </div>

      </div>
    )
  }

  if (pokemonList.length === 0) {
    return (<div>Loading...</div>)
  }

  return (
    <div className="App">
      <audio id="audio" src="public/backgroundMusic.mp3" autoPlay loop></audio>
      <audio id="selectSound" src="public/selectSound.mp3" ></audio>

      <img width="50px" height="50px" src="https://i.pinimg.com/originals/32/eb/23/32eb230b326ee3c76e64f619a06f6ebb.png"></img>
      <h1>PokeMemory by Nols</h1>
      <p>Click every card just once</p>


      <Counter score={score} maxScore={maxScore}></Counter>

      <div className="card-container">
        {pokemonList.map((pokemon, index) =>
          (<Card onClick={handleCardClick} pokemon={pokemon} key={index} />))
        }
      </div>

      {gameState === 'won' && (
        <div className="gameover">
          <p>You won!</p>
          <button onClick={resetGame} className="gameover_btn">Try again</button>
          <button onClick={() => setIsGameStarted(false)} className="gameover_btn">Change difficulty</button>
        </div>

      )}

      {gameState === 'lost' && (
        <div className="gameover">
          <p>You lost!</p>
          <button onClick={resetGame} className="gameover_btn">Try again</button>
          <button onClick={() => setIsGameStarted(false)} className="gameover_btn">Change difficulty</button>
        </div>

      )}

    </div>
  )
}

export default App
