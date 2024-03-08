import Express from "express";
import { conn } from "../dbconnect";
import { Creator } from "../model/modelTable";
import mysql from "mysql";

export const router = Express.Router();

router.delete("/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("DELETE FROM creator WHERE creatorID = ?", [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

router.post('/', (req, res) => {
    let creator: Creator = req.body;

    let sql = "INSERT INTO `creator` (`person_ID`,`movie_ID`)  VALUES (?,?)"

    sql = mysql.format(sql, [
        creator.person_ID,
        creator.movie_ID
       
    ]);

    conn.query(sql, (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            res.status(500).json({ error: "Internal Server Error" , err});
        } else {
            res.status(201).json({
                affected_row: result.affectedRows,
                last_idx: result.insertId
            });
        }
    });
})
