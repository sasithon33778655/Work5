import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { personJSON } from "../model/person_get_res";
export const router = express.Router();

router.get("/", (req, res) => {
  conn.query("SELECT * FROM person", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

router.delete("/:id", (req, res) => {
  const personId = +req.params.id;

  conn.query(
    "DELETE FROM stars WHERE person_id = ?",
    [personId],
    (starsErr, starsResult) => {
      if (starsErr) {
        console.error("Delete stars error:", starsErr);
        res.status(500).json({ error: "Internal Server Error", err: starsErr });
      } else {
        conn.query(
          "DELETE FROM creator WHERE person_id = ?",
          [personId],
          (creatorsErr, creatorsResult) => {
            if (creatorsErr) {
              console.error("Delete creators error:", creatorsErr);
              res
                .status(500)
                .json({ error: "Internal Server Error", err: creatorsErr });
            } else {
              conn.query(
                "DELETE FROM person WHERE person_id = ?",
                [personId],
                (personErr, personResult) => {
                  if (personErr) {
                    console.error("Delete person error:", personErr);
                    res
                      .status(500)
                      .json({ error: "Internal Server Error", err: personErr });
                  } else {
                    res.status(200).json({
                      affected_rows: {
                        stars: starsResult.affectedRows,
                        creators: creatorsResult.affectedRows,
                        person: personResult.affectedRows,
                      },
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/", (req, res) => {
  const insertReq: personJSON = req.body;
  let sql = "INSERT INTO `person` (`name`,`biography`,`image`)  VALUES (?,?,?)";

  sql = mysql.format(sql, [
    insertReq.name,
    insertReq.biography,
    insertReq.image,
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
