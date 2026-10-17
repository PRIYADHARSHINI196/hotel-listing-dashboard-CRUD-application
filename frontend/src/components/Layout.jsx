import { Link } from 'react-router-dom';

export default function Layout({ title, crumbs = [], children }) {
  return (
    <>
      <header className="topbar">
        <Link to="/" className="logo">HotelFinder</Link>
        <Link to="/hotels/add" className="btn btn-primary">+ Add Hotel</Link>
      </header>
      <section className="banner">
        <div className="container">
          <h1>{title}</h1>
          <p className="crumbs">
            <Link to="/">Home</Link>
            {crumbs.map((c) => <span key={c}> &gt; {c}</span>)}
          </p>
        </div>
      </section>
      <main className="container">{children}</main>
      <footer className="footer">
        <div className="container">
          <h2>HotelFinder</h2>
          <p>Hotel listing management interface.</p>
          <p>© 2026 HotelFinder. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}