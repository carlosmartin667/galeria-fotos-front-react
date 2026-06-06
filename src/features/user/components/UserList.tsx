import { Link } from 'react-router-dom';
export function UserCard({ title, description, to, action }: { title: string; description?: string; to?: string; action?: React.ReactNode }) {
  const body = <div className="card border-0 shadow-sm h-100"><div className="card-body"><h2 className="h6">{title}</h2>{description ? <p className="text-secondary small">{description}</p> : null}{action}</div></div>;
  return to ? <Link className="text-body" to={to}>{body}</Link> : body;
}
