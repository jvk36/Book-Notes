import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookreviews",
    password: "pwd37assor",
    port: 5433,
  });
  db.connect();
  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var bookDatabase = [];
async function getBookDatabase() {
    const result = await db.query("SELECT * FROM reviews");
    return result.rows;
}

app.get("/", async (req, res) => {
    bookDatabase = await getBookDatabase();
    // console.log(bookDatabase);
    res.render("index.ejs", {
        bookData: bookDatabase
    })
});

app.get("/new", (req, res)=> {
    res.render("newbookreview.ejs")
});

app.post("/view", (req, res)=> {
    // console.log(req.body.title);
    for (let i=0; i<bookDatabase.length; i++) {
        if (bookDatabase[i].title === req.body.bookTitle) {
            res.render("viewbookreview.ejs", {
                bookTitle: bookDatabase[i].title,
                bookISBN: bookDatabase[i].isbn,
                bookReview: bookDatabase[i].review_text
            });
            break;
        }
    };
});

app.post("/submit", async (req, res)=> {
    try {
        await db.query(
          "INSERT INTO reviews (title, isbn, review_text) VALUES ($1, $2, $3)",
          [req.body.bookTitle, req.body.bookISBN, req.body.bookReview]
        );
        res.redirect("/");
      } catch (err) {
        console.log(err);
      }
});

app.post("/viewDone", async (req, res)=> {
    // console.log(req.body.bookTitle);
    if (req.body.action==="Delete") {
        try {
            await db.query(
              "DELETE FROM reviews WHERE title = $1",
              [req.body.bookTitle]
            );
            res.redirect("/");
          } catch (err) {
            console.log(err);
          }
    } else if (req.body.action==="Update") {
        // console.log(req.body.bookTitle);
        res.render("updatebookreview.ejs", {
            bookTitle: req.body.bookTitle,
            bookISBN: req.body.bookISBN,
            bookReview: req.body.bookReview
        });                
    } else {
        res.redirect('/');
    }
    // res.render("index.ejs", {
    //     bookData: bookDatabase
    // })
});

app.post("/update", async (req, res)=> {
    try {
        await db.query(
          "UPDATE reviews SET review_text = $1 WHERE title = $2",
          [req.body.bookReview, req.body.bookTitle]
        );
        res.redirect("/");
      } catch (err) {
        console.log(err);
      }
});


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
});
