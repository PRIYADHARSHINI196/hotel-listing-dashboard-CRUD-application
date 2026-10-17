import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Layout from '../components/Layout';
import HotelForm from '../components/HotelForm';
import { API, showToast } from '../store/hotelSlice';

export default function AddHotel() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const submit = async (fd) => {
    try {
      await axios.post(`${API}/api/hotels`, fd);
      dispatch(showToast('Hotel added successfully'));
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.errors?.map((x) => x.msg).join(', ') || e.response?.data?.message || e.message);
    }
  };

  return (
    <Layout title="Add Hotel" crumbs={['Hotels', 'Add']}>
      <Helmet><title>Add hotel - HotelFinder</title></Helmet>
      <HotelForm onSubmit={submit} submitLabel="Add hotel" serverError={error} />
    </Layout>
  );
}