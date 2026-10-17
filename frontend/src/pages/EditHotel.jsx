import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Layout from '../components/Layout';
import HotelForm from '../components/HotelForm';
import { API, showToast } from '../store/hotelSlice';

export default function EditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/hotels/${id}`).then((r) => setHotel(r.data)).catch((e) => setError(e.message));
  }, [id]);

  const submit = async (fd) => {
    try {
      await axios.put(`${API}/api/hotels/${id}`, fd);
      dispatch(showToast('Hotel updated successfully'));
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.errors?.map((x) => x.msg).join(', ') || e.response?.data?.message || e.message);
    }
  };

  return (
    <Layout title="Edit Hotel" crumbs={['Hotels', 'Edit']}>
      <Helmet><title>Edit hotel - HotelFinder</title></Helmet>
      {hotel ? (
        <HotelForm initialValues={hotel} onSubmit={submit} submitLabel="Update hotel" serverError={error} />
      ) : (
        <p>{error || 'Loading…'}</p>
      )}
    </Layout>
  );
}