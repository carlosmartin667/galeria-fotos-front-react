import { Link } from 'react-router-dom';

interface PublicCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  to?: string;
  meta?: string;
}

export function PublicCard({ title, description, imageUrl, to, meta }: PublicCardProps) {
  const content = (
    <div className="card border-0 shadow-sm h-100">
      {imageUrl ? <img src={imageUrl} className="card-img-top" alt="" loading="lazy" /> : null}
      <div className="card-body">
        {meta ? <div className="small text-secondary mb-2">{meta}</div> : null}
        <h2 className="h5">{title}</h2>
        {description ? <p className="text-secondary mb-0">{description}</p> : null}
      </div>
    </div>
  );

  return to ? (
    <Link className="text-body" to={to}>
      {content}
    </Link>
  ) : (
    content
  );
}
