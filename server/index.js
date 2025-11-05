require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Simple auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth token' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid auth format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Register with validation - WARNING: Storing plain text passwords (NOT SECURE - for testing only)
app.post('/api/auth/register',
  [
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password min length 6')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;
    try {
      const [rows] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
      if (rows.length) return res.status(400).json({ error: 'Email already registered' });
      // Storing plain text password (INSECURE - for testing only)
      const [result] = await db.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
      const userId = result.insertId;
      const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: userId, name, email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login - WARNING: Using plain text password comparison (NOT SECURE - for testing only)
app.post('/api/auth/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 1 }).withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const [rows] = await db.query('SELECT id, name, email, password FROM Users WHERE email = ?', [email]);
      if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
      const user = rows[0];
      // Plain text password comparison (INSECURE - for testing only)
      const ok = password === user.password;
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// List papers with authors & tags
app.get('/api/papers', async (req, res) => {
  try {
    const [papers] = await db.query(`
      SELECT p.id, p.title, p.abstract, p.year, p.url, p.pdf_key, p.added_by, p.added_at, p.updated_at,
             GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS authors,
             GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') AS tags
      FROM Papers p
      LEFT JOIN Paper_Authors pa ON p.id = pa.paper_id
      LEFT JOIN Authors a ON pa.author_id = a.id
      LEFT JOIN Paper_Tags pt ON p.id = pt.paper_id
      LEFT JOIN Tags t ON pt.tags_id = t.id
      GROUP BY p.id
      ORDER BY p.added_at DESC
    `);
    res.json(papers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single paper details
app.get('/api/papers/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [[paper]] = await db.query(`
      SELECT p.id, p.title, p.abstract, p.year, p.url, p.pdf_key, p.added_by, p.added_at, p.updated_at
      FROM Papers p WHERE p.id = ?
    `, [id]);
    if (!paper) return res.status(404).json({ error: 'Not found' });
    const [authors] = await db.query(`
      SELECT a.id, a.name FROM Authors a
      JOIN Paper_Authors pa ON a.id = pa.author_id
      WHERE pa.paper_id = ?
    `, [id]);
    const [tags] = await db.query(`
      SELECT t.id, t.name FROM Tags t
      JOIN Paper_Tags pt ON t.id = pt.tags_id
      WHERE pt.paper_id = ?
    `, [id]);
    const [refs] = await db.query('SELECT cited_title FROM Paper_References WHERE paper_id = ?', [id]);
    res.json({ ...paper, authors, tags, references: refs.map(r => r.cited_title) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new paper (protected)
app.post('/api/papers', authMiddleware,
  [ body('title').isLength({ min: 1 }).withMessage('Title is required') ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, abstract, year, url, pdf_key, authors, tags, references } = req.body;
    try {
      const [result] = await db.query('INSERT INTO Papers (title, abstract, year, url, pdf_key, added_by) VALUES (?, ?, ?, ?, ?, ?)',
        [title, abstract || null, year || null, url || null, pdf_key || null, req.user.id]);
      const paperId = result.insertId;

      // Authors handling
      let authorList = [];
      if (Array.isArray(authors)) authorList = authors.map(a => a.trim()).filter(Boolean);
      else if (typeof authors === 'string') authorList = authors.split(',').map(a => a.trim()).filter(Boolean);
      for (const name of authorList) {
        const [rows] = await db.query('SELECT id FROM Authors WHERE name = ?', [name]);
        let authorId;
        if (rows.length) authorId = rows[0].id;
        else {
          const [r2] = await db.query('INSERT INTO Authors (name) VALUES (?)', [name]);
          authorId = r2.insertId;
        }
        await db.query('INSERT INTO Paper_Authors (paper_id, author_id) VALUES (?, ?)', [paperId, authorId]);
      }

      // Tags handling
      let tagList = [];
      if (Array.isArray(tags)) tagList = tags.map(t => t.trim()).filter(Boolean);
      else if (typeof tags === 'string') tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      for (const tname of tagList) {
        const [rows] = await db.query('SELECT id FROM Tags WHERE name = ?', [tname]);
        let tagId;
        if (rows.length) tagId = rows[0].id;
        else {
          const [r2] = await db.query('INSERT INTO Tags (name) VALUES (?)', [tname]);
          tagId = r2.insertId;
        }
        await db.query('INSERT INTO Paper_Tags (paper_id, tags_id) VALUES (?, ?)', [paperId, tagId]);
      }

      // References
      let refList = [];
      if (Array.isArray(references)) refList = references.map(r => r.trim()).filter(Boolean);
      else if (typeof references === 'string') refList = references.split(',').map(r => r.trim()).filter(Boolean);
      for (const cited of refList) {
        await db.query('INSERT INTO Paper_References (cited_title, paper_id) VALUES (?, ?)', [cited, paperId]);
      }

      res.status(201).json({ id: paperId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get papers added by a user
app.get('/api/users/:id/papers', async (req, res) => {
  const userId = Number(req.params.id);
  if (!userId) return res.status(400).json({ error: 'Invalid id' });
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.title, p.year, p.url, p.pdf_key,
             GROUP_CONCAT(DISTINCT a.name) AS Authors,
             GROUP_CONCAT(DISTINCT t.name) AS Tags
      FROM Papers p
      LEFT JOIN Paper_Authors pa ON p.id = pa.paper_id
      LEFT JOIN Authors a ON pa.author_id = a.id
      LEFT JOIN Paper_Tags pt ON p.id = pt.paper_id
      LEFT JOIN Tags t ON pt.tags_id = t.id
      WHERE p.added_by = ?
      GROUP BY p.id
    `, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List tags
app.get('/api/tags', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM Tags ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List authors
app.get('/api/authors', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, qualification, institute FROM Authors ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update paper (protected)
app.put('/api/papers/:id', authMiddleware,
  [ body('title').isLength({ min: 1 }).withMessage('Title is required') ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const paperId = Number(req.params.id);
    const { title, abstract, year, url, pdf_key } = req.body;
    
    try {
      // Check ownership
      const [[paper]] = await db.query('SELECT added_by FROM Papers WHERE id = ?', [paperId]);
      if (!paper) return res.status(404).json({ error: 'Paper not found' });
      if (paper.added_by !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
      
      // Update paper
      await db.query('CALL UpdatePaper(?, ?, ?, ?, ?, ?)',
        [paperId, title, abstract || null, year || null, url || null, pdf_key || null]);
      
      res.json({ success: true, message: 'Paper updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete paper (protected)
app.delete('/api/papers/:id', authMiddleware, async (req, res) => {
  const paperId = Number(req.params.id);
  
  try {
    // Check ownership
    const [[paper]] = await db.query('SELECT added_by FROM Papers WHERE id = ?', [paperId]);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    if (paper.added_by !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    
    // Delete paper using stored procedure
    await db.query('CALL DeletePaper(?)', [paperId]);
    
    res.json({ success: true, message: 'Paper deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search papers
app.get('/api/papers/search/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const [rows] = await db.query('CALL SearchPapers(?)', [keyword]);
    res.json(rows[0] || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get papers by tag
app.get('/api/papers/tag/:tagName', async (req, res) => {
  const tagName = req.params.tagName;
  try {
    const [rows] = await db.query('CALL GetPapersByTag(?)', [tagName]);
    res.json(rows[0] || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get paper statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const [rows] = await db.query('CALL GetPaperStatistics()');
    res.json(rows[0][0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start only when run directly (allow importing for tests)
const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
