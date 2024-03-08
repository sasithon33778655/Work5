import Express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";
import { Stars } from "../model/modelTable";

export const router = Express.Router();

router.delete("/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("DELETE FROM stars WHERE starID = ?", [id], (err, result) => {
        if (err) throw err;
        res.status(200).json
            ({ affected_row: result.affectedRows });
    })
})

router.post('/', (req, res) => {
    let star: Stars = req.body;

    let sql = "INSERT INTO `stars` (`person_ID`,`movie_ID`)  VALUES (?,?)"

    sql = mysql.format(sql, [
        star.person_ID,
        star.movie_ID
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


