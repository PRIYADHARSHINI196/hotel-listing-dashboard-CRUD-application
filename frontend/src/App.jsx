import { Routes, Route } from 'react-router-dom';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import AddHotel from './pages/AddHotel';
import EditHotel from './pages/EditHotel';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HotelList />} />
      <Route path="/hotels/add" element={<AddHotel />} />
      <Route path="/hotels/:id" element={<HotelDetail />} />
      <Route path="/hotels/:id/edit" element={<EditHotel />} />
    </Routes>
  );
}