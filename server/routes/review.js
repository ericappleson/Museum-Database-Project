const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all reviews
router.get("/", (req, res) => {
  db.query("SELECT * FROM Review", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET review by review ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Review WHERE review_id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.length == 0) {
        res.status(404).json({ message: "Review not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Route to fetch reviews by exhibit_id
router.get("/exhibit/:id", (req, res) => {
  const exhibitId = req.params.id;

  const query = "SELECT * FROM Review WHERE exhibit_id = ?";

  db.query(query, [exhibitId], (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this exhibition" });
    }

    res.json(results);
  });
});

// GET reviews by customer ID
router.get('/customer/:id', (req, res) => {
    db.query('SELECT * FROM Review WHERE customer_id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'No reviews found for this customer' });
            return;
        }
        res.json(results);
    });
});

// Route to fetch reviews by exhibit_id
router.get('/exhibit/:id', (req, res) => {
    const exhibitId = req.params.id;

    const query = 'SELECT * FROM Review WHERE exhibit_id = ?';
    
    db.query(query, [exhibitId], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ error: 'Failed to fetch reviews' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this exhibition' });
        }

        res.json(results);
    });
});

// POST a new review
router.post("/", (req, res) => {
  const { customer_id, title, feedback, rating, date_posted, exhibit_id } =
    req.body;
  const insertQuery =
    "INSERT INTO Review (customer_id, title, feedback, rating, date_posted, exhibit_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    insertQuery,
    [customer_id, title, feedback, rating, date_posted, exhibit_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// PUT (update) a review
router.put('/:id', (req, res) => {
    const ReviewId = req.params.id;
    const updates = req.body;

    // Fetch review data
    const fetchQuery = 'SELECT * FROM Review WHERE review_id = ?';
    db.query(fetchQuery, [ReviewId], (fetchErr, fetchResult) => {
        if (fetchErr) {
            return res.status(500).json({ error: fetchErr.message });
        }
        if (fetchResult.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const currentReview = fetchResult[0];
        // Merge the updates with the current data
        const updatedReview = { ...currentReview, ...updates };

        const { customer_id, title, feedback, rating, date_posted, exhibit_id } = updatedReview;
        const updateQuery = 'UPDATE Review SET customer_id = ?, title = ?, feedback = ?, rating = ?, date_posted = ?, exhibit_id = ? WHERE review_id = ?';

        db.query(updateQuery, [customer_id, title, feedback, rating, date_posted, exhibit_id, ReviewId], (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).json({ error: updateErr.message });
            }
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Review not found' });
            }
            res.json({ id: ReviewId, ...updatedReview });
        });
    });
});


// Soft DELETE a review (set is_active to FALSE)
router.delete("/:id", (req, res) => {
  db.query(
    "UPDATE Review SET is_active = FALSE WHERE review_id = ? AND is_active = TRUE",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res
          .status(404)
          .json({ message: "Review not found or already inactive" });
        return;
      }
      res.json({ message: "Review successfully deactivated" });
    }
  );
});

// Optional: Reactivate review
router.patch("/:id/reactivate", (req, res) => {
  db.query(
    "UPDATE Review SET is_active = TRUE WHERE review_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Review not found" });
        return;
      }
      res.json({ message: "Review successfully reactivated" });
    }
  );
});

module.exports = router;
