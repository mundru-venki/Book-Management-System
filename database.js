const books = [
    {
        ISBN : "12345Book",
        title: "Tesla!!!",
        pubDate: "04-02-2023",
        language: "en",
        numPage: "250",
        author: ["1","2"],
        publication: ["1"],
        category: ["tech", "space", "education"]
    }
];

const author = [
    {
        id: "1",
        name: "Venkatesh",
        books: ["12345Book", "secretBook"],
    },
    {
        id: "2",
        name: "Elon Musk",
        books: ["12345Book"]
    }
];

const publication = [
    {
        id: "1",
        name: "writex",
        books: ["12345Book"]
    },
    {
        id: "2",
        name: "writex2",
        books: []
    }
];

module.exports = {books, author, publication};