import { curve, heroBackground } from "../assets";
import Section from "./Section";
import { BackgroundCircles, BottomLine } from "./design/Hero";
import { useState, useRef } from "react";

const Hero = () => {
  const parallaxRef = useRef(null);

  const [answers, setAnswers] = useState({
    age: 30,
    revenu_annuel: 30000,
    montant_investi: 10000,
    horizon: 5,
    risk_aversion: "faible",
    objectif: "croissance modérée",
    esg_preference: false,
  });

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
      const response = await fetch("http://127.0.0.1:8000/submit_profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const result = await response.json();
      alert("Profil reçu !");
      console.log(result);
    } catch (err) {
      console.error(err);
      alert("Erreur d'envoi");
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
            Bienvenue sur votre Assistant d’Investissement{" "}
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

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-xl mx-auto text-left">
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
                name="revenu_annuel"
                value={answers.revenu_annuel}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>
             <label className="block mb-3 text-black">
              Montant investi (€) :
              <input
                type="number"
                name="montant_investi"
                value={answers.montant_investi}
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
              Objectif d’investissement :
              <select
                name="objectif"
                value={answers.objectif}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="préservation du capital">Préservation du capital</option>
                <option value="croissance modérée">Croissance modérée</option>
                <option value="croissance agressive">Croissance agressive</option>
              </select>
            </label>

            <label className="block mb-6 text-black">
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
