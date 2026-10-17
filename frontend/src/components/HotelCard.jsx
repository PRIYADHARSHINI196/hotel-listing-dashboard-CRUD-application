import { useNavigate } from 'react-router-dom';
import { imgUrl } from '../store/hotelSlice';

export default function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();
  const snippet = hotel.description.length > 110 ? hotel.description.slice(0, 110) + '…' : hotel.description;
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };

  return (
    <article className="card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
      <img src={imgUrl(hotel.image_path)} alt={`${hotel.title} hotel`} />
      <div className="card-body">
        <h3>{hotel.title}</h3>
        <p>{snippet}</p>
      </div>
      <div className="card-side">
        <div className="price">₹{Number(hotel.price).toLocaleString('en-IN')}</div>
        <small>per night</small>
        <button className="btn btn-primary" onClick={stop(() => navigate(`/hotels/${hotel.id}`))}>View details</button>
        <button className="btn btn-outline" onClick={stop(() => navigate(`/hotels/${hotel.id}/edit`))}>Edit</button>
        <button className="btn btn-danger" onClick={stop(() => onDelete(hotel.id))}>Delete</button>
      </div>
    </article>
  );
}