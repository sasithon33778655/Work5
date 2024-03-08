import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { MovieJSON } from "../model/movie_get_res";
export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("SELECT * FROM movie", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const Movie: MovieJSON = req.body;
  let sql =
    "INSERT INTO `movie` (`title`,`year`,`plot`,`poster`,`genre`)  VALUES (?,?,?,?,?)";

  sql = mysql.format(sql, [
    Movie.title,
    Movie.year,
    Movie.plot,
    Movie.poster,
    Movie.genre,
  ]);

  conn.query(sql, (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Internal Server Error", err });
    } else {
      res.status(201).json({
        affected_row: result.affectedRows,
        last_idx: result.insertId,
      });
    }
  });
});

router.delete("/:id", (req, res) => {
  const movieId = +req.params.id;

  conn.query(
    "DELETE FROM stars WHERE movie_id = ?",
    [movieId],
    (starsErr, starsResult) => {
      if (starsErr) {
        throw starsErr;
      }
      conn.query(
        "DELETE FROM creator WHERE movie_id = ?",
        [movieId],
        (creatorsErr, creatorsResult) => {
          if (creatorsErr) {
            throw creatorsErr;
          }
          conn.query(
            "DELETE FROM movie WHERE movie_id = ?",
            [movieId],
            (movieErr, movieResult) => {
              if (movieErr) {
                throw movieErr;
              }

              res.status(200).json({
                affected_rows: {
                  stars: starsResult.affectedRows,
                  creators: creatorsResult.affectedRows,
                  movie: movieResult.affectedRows,
                },
              });
            }
          );
        }
      );
    }
  );
});
