import { useState } from "react";
import { questions } from "./data/questions";

export default function App() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [category, setCategory] = useState(null);
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  const startGame = () => {
    if (player1.trim() && player2.trim()) {
      setGameStarted(true);
    }
  };

  const getRandomQuestion = (cat) => {
    const qList = questions[cat];
    if (!qList || qList.length === 0) return;
    const q = qList[Math.floor(Math.random() * qList.length)];
    setCategory(cat);
    setQuestion(q);
    setHistory((prev) => [...prev, { cat, q }]);
  };

  const addScore = (points) => {
    setScore((prev) => prev + points);
    if (category) getRandomQuestion(category);
  };

  // 🎨 Kis szív animáció komponens
  const FloatingHearts = () => (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute text-pink-300 animate-bounce opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}
        >
          💖
        </div>
      ))}
    </div>
  );

  // 🏁 Kezdőképernyő
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-200 to-blue-100 text-center relative">
        <FloatingHearts />
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg max-w-md w-full">
          <h1 className="text-5xl font-bold text-pink-600 mb-4">💞 Kettőnk Titkai 💞</h1>
          <p className="text-gray-700 mb-6">
            Egy játék, ami közelebb hoz benneteket – nevetéssel, kérdésekkel és szívvel 💕
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <input
              type="text"
              placeholder="Te neved..."
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="rounded-xl border border-pink-300 px-4 py-2 text-center focus:ring-2 focus:ring-pink-400 outline-none"
            />
            <input
              type="text"
              placeholder="Párod neve..."
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="rounded-xl border border-pink-300 px-4 py-2 text-center focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          <button
            onClick={startGame}
            disabled={!player1 || !player2}
            className={`px-6 py-3 rounded-2xl font-semibold text-white transition-all ${
              player1 && player2
                ? "bg-pink-500 hover:bg-pink-600 shadow-md"
                : "bg-pink-300 cursor-not-allowed"
            }`}
          >
            💫 Játék indítása
          </button>
        </div>
      </div>
    );
  }

  // 🎲 Játék képernyő
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-100 to-blue-100 text-center">
      <h1 className="text-3xl font-bold text-pink-600 mb-2">
        {player1} 💞 {player2}
      </h1>
      <p className="text-gray-700 mb-6 max-w-md">
        Egy játék, ahol nevetés, kíváncsiság és szerelem keveredik 💬
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {Object.keys(questions).map((cat) => (
          <button
            key={cat}
            onClick={() => getRandomQuestion(cat)}
            className={`${
              category === cat ? "bg-pink-600" : "bg-pink-400"
            } hover:bg-pink-500 text-white rounded-xl px-4 py-2 transition-all`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {question && (
        <div className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-md">
          <p className="text-lg text-gray-800 mb-4">{question}</p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => addScore(2)}
              className="bg-green-400 hover:bg-green-500 text-white rounded-lg px-3 py-1"
            >
              💚 Egyezett
            </button>
            <button
              onClick={() => addScore(1)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg px-3 py-1"
            >
              😄 Részben
            </button>
            <button
              onClick={() => addScore(0)}
              className="bg-red-400 hover:bg-red-500 text-white rounded-lg px-3 py-1"
            >
              🤭 Nem egyezett
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 text-gray-800 text-lg font-semibold">
        💗 Pontszám: <span className="text-pink-600">{score}</span>
      </div>

      {score >= 20 && (
        <div className="mt-4 text-2xl text-pink-700 font-bold animate-bounce">
          🎉 Tökéletes összhang! 🎉
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 w-full max-w-md bg-white p-4 rounded-xl shadow-inner">
          <h2 className="text-xl font-semibold mb-2 text-pink-500">Korábbi kérdések</h2>
          <ul className="text-left text-gray-700 text-sm space-y-1">
            {history.slice(-5).map((h, i) => (
              <li key={i}>
                <strong>{h.cat.toUpperCase()}:</strong> {h.q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
