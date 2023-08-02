const express = require("express");
const bodyParser = require("body-parser");

//Database
const database = require("./database");

//initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());


/* 
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",(req,res) => {
    return res.json({books: database.books});
});


/* 
Route            /is
Description      Get specific book based  on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );
    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }    
    return res.json({book: getSpecificBook});
});


/* 
Route            /c
Description      Get specific books based on category
Access           PUBLIC
Parameter        category
Methods          GET
*/
booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the category ${req.params.category}`});
    }
    return res.json({book: getSpecificBook});
});


/* 
Route            /lang
Description      Get specific books based on language
Access           PUBLIC
Parameter        language
Methods          GET
*/
booky.get("/lang/:language", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );
    if(getSpecificBook.length === 0) {
        return res.json({error: `No book for the language ${req.params.language}`});
    }
    return res.json({book: getSpecificBook});
});


/* 
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/author", (req,res) => {
    return res.json({author: database.author});
});


/* 
Route            /author/id
Description      Get specific author based on id
Access           PUBLIC
Parameter        i
Methods          GET
*/
booky.get("/author/id/:id", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === req.params.id
);
    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No book for the language ${req.params.id}` });
    }
    return res.json({ author: getSpecificAuthor });
});


/* 
Route            /author/book
Description      Get specific author based on book
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No author found for isbn ${req.params.isbn}`});
    }
    return res.json({author: getSpecificAuthor});
});


/* 
Route            /publication
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/publication", (req,res) => {
    return res.json({publication: database.publication});
});


/* 
Route            /publication/id
Description      Get publication based on id
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/publication/id/:id", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === req.params.id
    );
    if(getSpecificPublication.length === 0) {
        return res.json({error: `No publication found for id ${req.params.id}`});
    }
    return res.json({publication: getSpecificPublication});
});


/* 
Route            /publication/id
Description      Get specific publication based on book
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/publication/book/:isbn", (req, res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );
    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No publication found for isbn ${req.params.isbn}` });
    }
    return res.json({ publication: getSpecificPublication });
});


//POST

/* 
Route            /book/new
Description      Add new book
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/book/new", (req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBook: database.books});
});


/* 
Route            /author/new
Description      Add new author
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/author/new", (req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthor: database.author});
});


/* 
Route            /publication/new
Description      Add new publication
Access           PUBLIC
Parameter        NONE
Methods          POST
*/
booky.post("/publication/new", (req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatePublication: database.publication});
});


//PUT

/* 
Route            /publication/update/book
Description      Update or Add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push( req.params.isbn);
        }
    });
    
    //Update the book database
    database.books.forEach((book) => {
       if(book.ISBN === req.params.isbn) {
         book.publication = req.body.pubId;
         return;
       }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "successfully updated publication"
        }
    );

});


/* 
Route            /book/delete
Description      Delete or book based on isbn
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});


/* 
Route            /author/delete
Description      Delete author from book
Access           PUBLIC
Parameter        id
Methods          DELETE
*/
booky.delete("/author/delete/:authorId", (req,res) => {
     database.books.forEach((book) => {
     const newAuthorList = book.author.filter(
            (eachAuthor) => eachAuthor !== req.params.authorId
       );
        book.author = newAuthorList;
     });
    
    return res.json({books: database.books});
});


/* 
Route            /book/delete/author
Description      Delete author from book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //update the book database
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    //update the author database
    database.author.forEach((eachAuthor) =>{
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });
    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!!"
    });
});




booky.listen(3000, () => {
    console.log("Server is up and running");
});