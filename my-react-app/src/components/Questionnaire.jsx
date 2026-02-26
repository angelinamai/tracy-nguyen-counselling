import { useSiteLang } from "../content/useSiteLang";

export default function Questionnaire() {
  const { text } = useSiteLang();
  const questionnaire = text.questionnaire;

  return (
    <section className="questionnaire">
      <h2 className="qTitle">{questionnaire.title}</h2>
      <p className="qText">{questionnaire.intro}</p>

      <form className="qForm">
        <label className="qLabel">{questionnaire.mainAreaLabel}</label>

        <div className="qOptions">
          {questionnaire.options.map((item) => (
            <label key={item} className="qOption">
              <input type="checkbox" name="supportAreas" value={item} />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <label className="qLabel">{questionnaire.anythingElseLabel}</label>
        <textarea rows="6" className="qTextarea" />

        <button type="submit" className="contactSubmit">
          {questionnaire.submit}
        </button>
      </form>
    </section>
  );
}
