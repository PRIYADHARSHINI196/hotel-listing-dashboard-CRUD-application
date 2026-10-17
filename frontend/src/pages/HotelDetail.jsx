import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../components/Layout';
import { API, imgUrl } from '../store/hotelSlice';

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/hotels/${id}`).then((r) => setHotel(r.data)).catch(() => setError('Hotel not found'));
  }, [id]);

  // Browser Geolocation API
  const locateMe = () => {
    if (!navigator.geolocation) return alert('Geolocation is not supported by this browser');
    navigator.geolocation.getCurrentPosition(
      (p) => setMe([p.coords.latitude, p.coords.longitude]),
      () => alert('Could not get your location. Allow location access and try again.')
    );
  };

  if (error) return <Layout title="Hotel Details"><p className="err box">{error}</p></Layout>;
  if (!hotel) return <Layout title="Hotel Details"><p>Loading…</p></Layout>;

  const pos = [Number(hotel.latitude), Number(hotel.longitude)];

  return (
    <Layout title="Hotel Details" crumbs={['Hotels', hotel.title]}>
      <Helmet>
        <title>{hotel.title} - HotelFinder</title>
        <meta name="description" content={hotel.description.slice(0, 150)} />
      </Helmet>
      <Link to="/" className="back">← Back to hotels</Link>
      <img className="hero" src={imgUrl(hotel.image_path)} alt={`${hotel.title} hotel`} />
      <div className="detail-head">
        <h2>{hotel.title}</h2>
        <div className="price">₹{Number(hotel.price).toLocaleString('en-IN')} <small>per night</small></div>
      </div>
      <p>{hotel.description}</p>
      <h3>Location</h3>
      <p>Latitude {hotel.latitude}, Longitude {hotel.longitude}</p>
      <MapContainer center={pos} zoom={14} className="map" scrollWheelZoom={false}>
        <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker center={pos} radius={10}><Popup>{hotel.title}</Popup></CircleMarker>
        {me && <CircleMarker center={me} radius={8} pathOptions={{ color: 'green' }}><Popup>You are here</Popup></CircleMarker>}
      </MapContainer>
      <button className="btn btn-outline locate" onClick={locateMe}>Show my location</button>
    </Layout>
  );
}