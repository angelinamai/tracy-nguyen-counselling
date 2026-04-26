export default function BlogImage({ src, alt, caption }) {
  return (
    <figure className="blogInlineImageFigure">
      <img
        src={src}
        alt={alt}
        className="blogInlineImage"
        loading="lazy"
      />
      {caption ? <figcaption className="blogInlineImageCaption">{caption}</figcaption> : null}
    </figure>
  );
}
