

export default function Card({ pokemon, onClick }) {

    return (
        <button className="card" onClick={() => onClick(pokemon)}>
            <img className="card_img" src={pokemon.sprites.front_default} alt={pokemon.name} width="200rem" height="200rem"></img>
            <p className="card_title">{pokemon.name}</p>
        </button>
    )
}