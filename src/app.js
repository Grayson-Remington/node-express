import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pg from 'pg';
import * as middleware from './utils/middleware.js';
import helloRoute from './routes/helloRouter.js';

const app = express();

// parse json request body
app.use(express.json());
const connectionString =
	'postgresql://postgres:rVzMhszDFrNphBTObthHLfHUpPkVVXDi@roundhouse.proxy.rlwy.net:51652/railway';
const pool = new pg.Pool({ connectionString });
// enable cors
app.use(cors());

// request logger middleware
app.use(morgan('tiny'));

app.get('/', (req, res) => {
	res.send('Welcome to the Points API!');
});

// Endpoint to save a new point
app.post('/points', async (req, res) => {
	const { graphic, graphic_id } = req.body;

	try {
		const result = await pool.query(
			'INSERT INTO points (graphic, graphic_id) VALUES ($1, $2) RETURNING *',
			[graphic, graphic_id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error('Error saving point:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
app.get('/points', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM points');
		res.json(result.rows);
	} catch (err) {
		console.error('Error fetching points:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
app.post('/update-point', async (req, res) => {
	const { graphic, graphic_id } = req.body;

	try {
		const result = await pool.query(
			'UPDATE points SET graphic = $1 WHERE graphic_id = $2 RETURNING *',
			[graphic, graphic_id]
		);

		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Graphic not found' });
		} else {
			res.json(result.rows[0]);
		}
	} catch (err) {
		console.error('Error updating point:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
// Endpoint to fetch all points

app.delete('/points/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query(
			'DELETE FROM points WHERE graphic_id = $1',
			[id]
		);
		if (result.rowCount > 0) {
			res.status(200).json({ message: 'Point deleted successfully' });
		} else {
			res.status(404).json({ error: 'Point not found' });
		}
	} catch (err) {
		console.error('Error deleting point:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
app.post('/polylines', async (req, res) => {
	const { graphic, graphic_id } = req.body;

	try {
		const result = await pool.query(
			'INSERT INTO polylines (graphic, graphic_id) VALUES ($1, $2) RETURNING *',
			[graphic, graphic_id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error('Error saving polyline:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/polylines', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM polylines');
		res.json(result.rows);
	} catch (err) {
		console.error('Error fetching polylines:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.post('/update-polyline', async (req, res) => {
	const { graphic, graphic_id } = req.body;

	try {
		const result = await pool.query(
			'UPDATE polylines SET graphic = $1 WHERE graphic_id = $2 RETURNING *',
			[graphic, graphic_id]
		);

		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Graphic not found' });
		} else {
			res.json(result.rows[0]);
		}
	} catch (err) {
		console.error('Error updating polyline:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.delete('/polylines/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query(
			'DELETE FROM polylines WHERE graphic_id = $1',
			[id]
		);
		if (result.rowCount > 0) {
			res.status(200).json({ message: 'Polyline deleted successfully' });
		} else {
			res.status(404).json({ error: 'Polyline not found' });
		}
	} catch (err) {
		console.error('Error deleting polyline:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.post('/undergroundlines', async (req, res) => {
	const { graphic, graphic_id } = req.body;

	try {
		const result = await pool.query(
			'INSERT INTO undergroundlines (graphic, graphic_id) VALUES ($1, $2) RETURNING *',
			[graphic, graphic_id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error('Error saving undergroundline:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/undergroundlines', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM undergroundlines');
		res.json(result.rows);
	} catch (err) {
		console.error('Error fetching undergroundLines:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.post('/update-undergroundline', async (req, res) => {
	const { graphic, graphic_id } = req.body;

	try {
		const result = await pool.query(
			'UPDATE undergroundlines SET graphic = $1 WHERE graphic_id = $2 RETURNING *',
			[graphic, graphic_id]
		);

		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Graphic not found' });
		} else {
			res.json(result.rows[0]);
		}
	} catch (err) {
		console.error('Error updating undergroundLine:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.delete('/undergroundlines/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const result = await pool.query(
			'DELETE FROM undergroundlines WHERE graphic_id = $1',
			[id]
		);
		if (result.rowCount > 0) {
			res.status(200).json({
				message: 'Underground Line deleted successfully',
			});
		} else {
			res.status(404).json({ error: 'Underground Line not found' });
		}
	} catch (err) {
		console.error('Error deleting polyline:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// healthcheck endpoint
app.get('/', (req, res) => {
	res.status(200).send({ status: 'ok' });
});

app.use('/hello', helloRoute);

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
