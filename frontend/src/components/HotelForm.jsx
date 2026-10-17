import { useState } from 'react';
import { imgUrl } from '../store/hotelSlice';

const empty = { title: '', description: '', latitude: '', longitude: '', price: '' };

export default function HotelForm({ initialValues, onSubmit, submitLabel = 'Save hotel', serverError }) {
  const [values, setValues] = useState({ ...empty, ...initialValues });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialValues?.image_path ? imgUrl(initialValues.image_path) : '');
  const [errors, setErrors] = useState({});

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!/image\/(jpeg|png|webp)/.test(f.type)) return setErrors({ ...errors, image: 'Only JPG, PNG or WEBP allowed' });
    if (f.size > 2 * 1024 * 1024) return setErrors({ ...errors, image: 'Image must be under 2 MB' });
    setErrors({ ...errors, image: '' });
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const validate = () => {
    const e = {};
    if (!preview) e.image = 'Please upload an image';
    if (!values.title.trim()) e.title = 'Title is required';
    if (values.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    const lat = Number(values.latitude), lng = Number(values.longitude);
    if (values.latitude === '' || isNaN(lat) || lat < -90 || lat > 90) e.latitude = 'Latitude must be between -90 and 90';
    if (values.longitude === '' || isNaN(lng) || lng < -180 || lng > 180) e.longitude = 'Longitude must be between -180 and 180';
    if (values.price === '' || isNaN(Number(values.price)) || Number(values.price) <= 0) e.price = 'Price must be greater than 0';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const fd = new FormData();
    ['title', 'description', 'latitude', 'longitude', 'price'].forEach((k) => fd.append(k, values[k]));
    if (file) fd.append('image', file);
    onSubmit(fd);
  };

  const field = (name, label, type = 'text') => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} step="any" value={values[name]} onChange={change} />
      {errors[name] && <span className="err">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="image">Image</label>
        <input id="image" type="file" accept="image/*" onChange={pickFile} />
        {preview && <img className="preview" src={preview} alt="Selected hotel preview" />}
        {errors.image && <span className="err">{errors.image}</span>}
      </div>
      {field('title', 'Title')}
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="4" value={values.description} onChange={change} />
        {errors.description && <span className="err">{errors.description}</span>}
      </div>
      <div className="row">
        {field('latitude', 'Latitude', 'number')}
        {field('longitude', 'Longitude', 'number')}
      </div>
      {field('price', 'Price per night (₹)', 'number')}
      {serverError && <div className="err box">{serverError}</div>}
      <button className="btn btn-primary" type="submit">{submitLabel}</button>
    </form>
  );
}