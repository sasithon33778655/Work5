import Express from "express";
import { conn } from "../dbconnect";

export const router = Express.Router();


router.get("/:name", (req, res) => {
    let search = req.params.name;
    conn.query(
      "SELECT * FROM movie WHERE title LIKE ?",
      ["%" + search + "%"],
      (err, Movie_result, fields) => {
        if (err) throw err;
  
        conn.query(
          "SELECT * FROM person INNER JOIN stars ON person.person_id = stars.person_id WHERE stars.movie_id IN (SELECT stars.movie_id FROM movie WHERE title LIKE ?)",
          ["%" + search + "%"],
          (err, Stars_result, fields) => {
            if (err) throw err;
            conn.query(
              "SELECT * FROM person INNER JOIN creator ON person.person_id = creator.person_id WHERE creator.movie_id IN (SELECT movie_id FROM movie WHERE title LIKE ?)",
              ["%" + search + "%"],
              (err, Creators_Result, fields) => {
                if (err) throw err;
        
  
                // Send the response with all data
                res.json({
                  Movie: Movie_result.map((movie: any) => ({
                    ...movie,
                    Stars: Stars_result.filter(
                      (star: any) => star.movie_id === movie.movie_id
                    ),
                    creators: Creators_Result.filter(
                      (creator: any) => creator.movie_id === movie.movie_id
                    ),
                  })),
                });
              }
            );
          }
        );
      }
    );
  });

