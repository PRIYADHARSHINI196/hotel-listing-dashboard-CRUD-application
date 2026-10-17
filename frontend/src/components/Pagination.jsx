export default function Pagination({ total, limit, page, onChange }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>«</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} className={n === page ? 'active' : ''} onClick={() => onChange(n)}>{n}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>»</button>
    </nav>
  );
}