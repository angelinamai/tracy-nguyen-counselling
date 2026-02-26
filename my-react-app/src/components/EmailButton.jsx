import { useSiteLang } from "../content/useSiteLang";

export default function EmailButton() {
  const { text } = useSiteLang();
  const emailButton = text.emailButton;
  const emailUser = "tracyincounseling";
  const emailDomain = "gmail.com";
  const email = `${emailUser}@${emailDomain}`;

  const handleEmailClick = () => {
    const subject = encodeURIComponent(emailButton.subject);
    const body = encodeURIComponent(emailButton.body);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <button
      className="btnPrimary"
      type="button"
      aria-label={emailButton.ariaLabel}
      onClick={handleEmailClick}
    >
      {emailButton.button}
    </button>
  );
}
