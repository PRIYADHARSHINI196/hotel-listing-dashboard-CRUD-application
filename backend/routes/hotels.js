const router = require('express').Router();
const fs = require('fs');
const pool = require('../db');
const upload = require('../middleware/upload');
const { hotelRules, check } = require('../middleware/validate');

// GET /api/hotels?title=&minPrice=&maxPrice=&limit=10&offset=0
router.get('/', async(req, res) => {
    try {
        const { title = '', minPrice = 0, maxPrice = 100000000, limit = 10, offset = 0 } = req.query;
        const params = [`%${title}%`, minPrice, maxPrice];
        const where = 'WHERE title ILIKE $1 AND price BETWEEN $2 AND $3';

        const data = await pool.query(
            `SELECT * FROM hotels ${where} ORDER BY id DESC LIMIT $4 OFFSET $5`, [...params, limit, offset]
        );
        const count = await pool.query(`SELECT COUNT(*) FROM hotels ${where}`, params);

        res.json({ total: Number(count.rows[0].count), hotels: data.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/hotels/:id
router.get('/:id', async(req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
        if (!rows[0]) return res.status(404).json({ message: 'Hotel not found' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/hotels
router.post('/', upload.single('image'), hotelRules, check, async(req, res) => {
    try {
        const { title, description, latitude, longitude, price } = req.body;
        const img = req.file ? `/uploads/${req.file.filename}` : null;
        const { rows } = await pool.query(
            `INSERT INTO hotels (title, description, image_path, latitude, longitude, price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [title, description, img, latitude, longitude, price]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/hotels/:id
router.put('/:id', upload.single('image'), hotelRules, check, async(req, res) => {
    try {
        const old = await pool.query('SELECT image_path FROM hotels WHERE id = $1', [req.params.id]);
        if (!old.rows[0]) return res.status(404).json({ message: 'Hotel not found' });

        let img = old.rows[0].image_path;
        if (req.file) {
            if (img) fs.unlink('.' + img, () => {}); // delete old image file
            img = `/uploads/${req.file.filename}`;
        }

        const { title, description, latitude, longitude, price } = req.body;
        const { rows } = await pool.query(
            `UPDATE hotels
       SET title=$1, description=$2, image_path=$3, latitude=$4, longitude=$5, price=$6
       WHERE id=$7 RETURNING *`, [title, description, img, latitude, longitude, price, req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/hotels/:id
router.delete('/:id', async(req, res) => {
    try {
        const { rows } = await pool.query(
            'DELETE FROM hotels WHERE id = $1 RETURNING image_path', [req.params.id]
        );
        if (!rows[0]) return res.status(404).json({ message: 'Hotel not found' });
        if (rows[0].image_path) fs.unlink('.' + rows[0].image_path, () => {});
        res.json({ message: 'Hotel deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;