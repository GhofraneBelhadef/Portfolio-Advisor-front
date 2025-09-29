import { curve, heroBackground } from "../assets";
import Section from "./Section";
import { BackgroundCircles, BottomLine } from "./design/Hero";
import { useState, useRef } from "react";
import axios from "axios";
import Button from "./Button";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter
} from 'recharts';

const Hero = () => {
  const parallaxRef = useRef(null);

  const [answers, setAnswers] = useState({
    email: "",           // ✅ Ajout de l'email
    age: 30,
    revenu: 30000,
    horizon: 5,
    risk_aversion: "faible",
    objectif: "préservation du capital",
    esg_preference: false,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnswers({
      ...answers,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/submit_profile",
        answers
      );

      setResult(response.data);
      setError("");
      console.log("Full result:", response.data);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'envoi du formulaire.");
    }
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Bienvenue sur votre Assistant Investissement{" "}
            <span className="inline-block relative">
              Robo-Advisor
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow max-w-xl mx-auto text-left"
          >
            {/* Champ email */}
            <label className="block mb-3 text-black">
              Email :
              <input
                type="email"
                name="email"
                value={answers.email}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>

            <label className="block mb-3 text-black">
              Âge :
              <input
                type="number"
                name="age"
                value={answers.age}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>

            <label className="block mb-3 text-black">
              Revenu annuel (€) :
              <input
                type="number"
                name="revenu"
                value={answers.revenu}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>

            <label className="block mb-3 text-black">
              Horizon investissement (années) :
              <input
                type="number"
                name="horizon"
                value={answers.horizon}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>

            <label className="block mb-3 text-black">
              Aversion au risque :
              <select
                name="risk_aversion"
                value={answers.risk_aversion}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="faible">Faible</option>
                <option value="moyenne">Moyenne</option>
                <option value="élevée">Élevée</option>
              </select>
            </label>

            <label className="block mb-3 text-black">
              Objectif investissement :
              <select
                name="objectif"
                value={answers.objectif}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="préservation du capital">
                  Préservation du capital
                </option>
                <option value="croissance modérée">Croissance modérée</option>
                <option value="croissance agressive">
                  Croissance agressive
                </option>
              </select>
            </label>

            <label className="block mb-6 text-black flex items-center">
              <input
                type="checkbox"
                name="esg_preference"
                checked={answers.esg_preference}
                onChange={handleChange}
                className="mr-2"
              />
              Préférence ESG
            </label>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Envoyer
            </button>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Résultats */}
          {result && (
            <div className="mt-6 text-left bg-gray-800 text-white p-4 rounded">
              <h3 className="text-lg font-bold mb-2">Résultat du profil :</h3>
              <p><strong>Email :</strong> {answers.email}</p>
              <p><strong>Profil :</strong> {result.profil}</p>
              <p><strong>Score de risque :</strong> {result.risk_score}</p>

              {result.classes_actifs && (
                <>
                  <p><strong>Classes actifs :</strong></p>
                  <ul>
                    {Object.entries(result.classes_actifs).map(([asset, weight]) => (
                      <li key={asset}>{asset}: {(weight * 100).toFixed(0)}%</li>
                    ))}
                  </ul>
                </>
              )}

              {result.portfolio_alloc && (
                <>
                  <p><strong>Allocation du portefeuille :</strong></p>
                  <ul>
                    {Object.entries(result.portfolio_alloc).map(([asset, weight]) => (
                      <li key={asset}>{asset}: {(weight * 100).toFixed(2)}%</li>
                    ))}
                  </ul>

                  {/* Pie Chart for Allocation */}
                  <h4 className="mt-4 text-md font-semibold">Diagramme en Camembert : Allocation</h4>
                  <div className="w-full h-64 bg-white rounded my-2">
                    <PieChart width={400} height={300}>
                      <Pie
                        data={Object.entries(result.portfolio_alloc)
                          .filter(([, weight]) => weight > 0)
                          .map(([asset, weight]) => ({ name: asset, value: weight * 100 }))}
                        cx="50%" cy="50%" outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(result.portfolio_alloc)
                          .filter(([, weight]) => weight > 0)
                          .map(([,], index) => (
                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                          ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </div>
                </>
              )}

              {/* Line Chart for Historical Performance */}
              {result.sim_performance && result.sim_performance.dates && result.sim_performance.dates.length > 0 && (
                <>
                  <h4 className="mt-4 text-md font-semibold">Performance Simulée Historique (Rendement Cumulé)</h4>
                  <div className="w-full h-64 bg-white rounded my-2">
                    <LineChart width={600} height={300} data={result.sim_performance.dates.map((date, i) => ({
                      date: date,
                      return: result.sim_performance.cumulative_returns[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip labelFormatter={(label) => `Date: ${label}`} />
                      <Legend />
                      <Line type="monotone" dataKey="return" stroke="#8884d8" name="Rendement Cumulé" />
                    </LineChart>
                  </div>
                </>
              )}

              {/* Efficient Frontier Chart */}
              {result.frontier_points && result.user_point && result.frontier_points.length > 0 && (
                <>
                  <h4 className="mt-4 text-md font-semibold">Frontière Efficiente : Rendement vs Risque</h4>
                  <div className="w-full h-64 bg-white rounded my-2 flex">
                    <ScatterChart width={600} height={300}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="risk" name="Risque" unit="%" />
                      <YAxis type="number" dataKey="return" name="Rendement" unit="%" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Line type="monotone" dataKey="return" data={result.frontier_points} stroke="#8884d8" name="Frontière Efficiente" dot={false} />
                      <Scatter name="Votre Portefeuille" data={[result.user_point]} fill="#FF8042" />
                    </ScatterChart>
                  </div>
                </>
              )}

              {result.user_portfolio && (
                <p className="mt-2">
                  <strong>Performance du Portefeuille :</strong> Rendement: {result.user_portfolio.ret.toFixed(4)}, Risque: {result.user_portfolio.risk.toFixed(4)}
                </p>
              )}

              {/* Bouton pour télécharger le PDF */}
           <Button
  className="mt-4 w-full mb-6" // même classes que ton autre Button
  onClick={async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate_pdf",
        answers,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapport_investissement.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la génération du PDF.");
    }
  }}
>
  Télécharger le rapport PDF
</Button>

            </div>
          )}
        </div>

        {/* Background design & gradient */}
        <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
          <img
            src={heroBackground}
            className="w-full"
            width={1440}
            height={1800}
            alt="hero"
          />
        </div>

        <BackgroundCircles />
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
