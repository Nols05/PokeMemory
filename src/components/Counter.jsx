
export default function Counter({ score, maxScore }) {

    return (
        <div className="counter">
            <p>Score: {score}</p>
            <p>Max Score: {maxScore}</p>
        </div>
    );
}