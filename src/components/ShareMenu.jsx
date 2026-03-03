import { useEffect, useMemo, useState } from "react";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaLink,
  FaXmark,
} from "react-icons/fa6";
import "./ShareMenu.css";
import { useSiteLang } from "../content/useSiteLang";

export default function ShareMenu({
  url,
  title,
  text: shareText,
  instagramProfileUrl = "https://www.instagram.com/", // replace with real IG
  tiktokProfileUrl = "https://www.tiktok.com/", // replace with real TikTok
}) {
  const { text } = useSiteLang();
  const share = text.shareMenu;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => url || window.location.href, [url]);
  const titleToShare = title ?? share.defaultTitle;
  const textToShare = shareText ?? share.defaultText;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(titleToShare);
  const encodedText = encodeURIComponent(textToShare);

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}&title=${encodedTitle}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt(share.copyThisLink, shareUrl);
    }
  }

  // ✅ NO native share sheet — always open modal
  function onShareClick() {
    setOpen(true);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className="btnGhost" type="button" onClick={onShareClick}>
        {share.button}
      </button>

      {open && (
        <div
          className="shareOverlay"
          role="dialog"
          aria-modal="true"
          aria-label={share.dialogLabel}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="shareModal">
            <div className="shareHeader">
              <div>
                <div className="shareTitle">{share.title}</div>
                <div className="shareSub">{share.subtitle}</div>
              </div>

              <button
                className="shareClose"
                type="button"
                aria-label={share.closeAria}
                onClick={() => setOpen(false)}
              >
                <FaXmark />
              </button>
            </div>

            <div className="shareGrid">
              <a
                className="shareBtn shareBtn--facebook"
                href={facebookShare}
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook /> Facebook
              </a>

              <a
                className="shareBtn shareBtn--x"
                href={xShare}
                target="_blank"
                rel="noreferrer"
              >
                <FaXTwitter /> X
              </a>

              <button
                className="shareBtn shareBtn--copy"
                type="button"
                onClick={copyLink}
              >
                <FaLink /> {copied ? share.copied : share.copyLink}
              </button>

              <a
                className="shareBtn shareBtn--instagram"
                href={instagramProfileUrl}
                target="_blank"
                rel="noreferrer"
                title={share.instagramTitle}
              >
                <FaInstagram /> Instagram
              </a>

              <a
                className="shareBtn shareBtn--tiktok"
                href={tiktokProfileUrl}
                target="_blank"
                rel="noreferrer"
                title={share.tiktokTitle}
              >
                <FaTiktok /> TikTok
              </a>
            </div>

            <div className="shareLinkRow">
              <input
                className="shareInput"
                value={shareUrl}
                readOnly
                aria-label={share.shareInputAria}
                onFocus={(e) => e.target.select()}
              />
              <button
                className="shareCopySmall"
                type="button"
                onClick={copyLink}
              >
                {share.copy}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
