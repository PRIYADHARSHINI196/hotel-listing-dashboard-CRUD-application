import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { fetchHotels, deleteHotel, setPage, setFilters, clearToast } from '../store/hotelSlice';

export default function HotelList() {
  const dispatch = useDispatch();
  const { items, total, loading, error, page, limit, filters, toast } = useSelector((s) => s.hotels);
  const [search, setSearch] = useState(filters.title);
  const [min, setMin] = useState(filters.minPrice);
  const [max, setMax] = useState(filters.maxPrice);

  // search debounce (400 ms)
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== filters.title) dispatch(setFilters({ title: search }));
    }, 400);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  // API call whenever page or filters change
  useEffect(() => {
    const params = { title: filters.title, limit, offset: (page - 1) * limit };
    if (filters.minPrice !== '') params.minPrice = filters.minPrice;
    if (filters.maxPrice !== '') params.maxPrice = filters.maxPrice;
    dispatch(fetchHotels(params));
  }, [dispatch, page, limit, filters]);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    await dispatch(deleteHotel(id));
    if (items.length === 1 && page > 1) dispatch(setPage(page - 1));
    else dispatch(setFilters({}));
  };

  const closeToast = useCallback(() => dispatch(clearToast()), [dispatch]);

  return (
    <Layout title="Hotel Listings" crumbs={['Hotels']}>
      <Helmet>
        <title>Hotel listings - HotelFinder</title>
        <meta name="description" content="Browse, search and manage hotel listings with price filters." />
      </Helmet>
      <Toast message={toast} onClose={closeToast} />

      <div className="layout">
        <aside className="filters">
          <h4>Search by title</h4>
          <input placeholder="Search hotels…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <h4>Price per night</h4>
          <div className="row">
            <input type="number" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} />
            <input type="number" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
          <button className="btn btn-outline" onClick={() => dispatch(setFilters({ minPrice: min, maxPrice: max }))}>Apply price</button>
          <button className="btn btn-outline" onClick={() => { setSearch(''); setMin(''); setMax(''); dispatch(setFilters({ title: '', minPrice: '', maxPrice: '' })); }}>Clear filters</button>
        </aside>

        <section className="list">
          <p className="count"><strong>{total}</strong> hotels found</p>
          {loading && <p>Loading…</p>}
          {error && <p className="err box">Could not load hotels: {error}</p>}
          {!loading && !error && items.length === 0 && <p>No hotels match. Try clearing the filters or add a new hotel.</p>}
          {items.map((h) => <HotelCard key={h.id} hotel={h} onDelete={onDelete} />)}
          <Pagination total={total} limit={limit} page={page} onChange={(p) => dispatch(setPage(p))} />
        </section>
      </div>
    </Layout>
  );
}