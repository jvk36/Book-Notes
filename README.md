# CP5 - Book Notes

A website to show my book reviews built using Node, Express, and Postgres.


## Building

Clone this repository, then edit index.js as follows:

1. Modify the 'db' variable initialization to match your Postgres DB settings.
2. Add a database named 'bookreviews' in Postgres and create the 'reviews' table 
   using the following script:

CREATE TABLE reviews
(
    title varchar(100) primary key,
    isbn varchar(30),
    review_text text
)

Next, bring up the shell in VSCode or other IDE and:

# install the modules in package.json
```shell
npm i
```
# use nodemon to run the server
```shell
nodemon index.js
```

Your server should now be running on: localhost:3000

## License

MIT
