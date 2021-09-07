const router = require("express").Router();
const { render } = require("../app");
const Book = require('../models/Book');

router.get('/books', (req, res, next) => {
	// get all the books from the db
	Book.find()
		.then(booksFromDB => {
			console.log(booksFromDB);
			// console.log('this is the books route');
			res.render('books', { bookList: booksFromDB });
		})
		.catch(err => {
			// instead of console logging the error we now pass it to the 
			// error handler via next()
			next(err);
		})
})

router.post('/books', (req, res, next) => {
	console.log(req.body);
	const { title, description, rating, author } = req.body;
	// create a new book in the database
	Book.create({
		title: title,
		description: description,
		rating: rating,
		author: author
	})
		.then(createdBook => {
			console.log(createdBook);
			// redirect / render the detail view for this book
			// res.render('bookDetails', { book: createdBook });
			// redirect to a specific url
			res.redirect(`/books/${createdBook._id}`);
		})
		.catch(err => next(err));
});


router.get('/books/add', (req, res, next) => {
	res.render('bookForm');
});

router.get('/books/:id', (req, res, next) => {
	console.log('book details');
	// get the book with the requested id from the db
	console.log(req.params);
	// const bookId = req.params.id;
	console.log(req.params.id);
	// get the book with the requested id
	Book.findById(req.params.id)
		.then(bookFromDB => {
			console.log(bookFromDB);
			// render a detail view
			res.render('bookDetails', { book: bookFromDB });
		})
		.catch(err => {
			next(err);
		})
});

router.get('/books/edit/:id', (req, res, next) => {
	console.log('editing this book');
	const bookId = req.params.id;
	Book.findById(bookId)
		.then(bookFromDB => {
			console.log(bookFromDB);
			res.render('bookEdit', { book: bookFromDB });
		})
		.catch(err => {
			next(err);
		})
});

router.post('/books/edit/:id', (req, res, next) => {
	const bookId = req.params.id;
	// const { title, author, description, rating } = req.body;
	const titleFromInput = req.body.title;
	const descriptionFromInput = req.body.description;
	const authorFromInput = req.body.author;
	const ratingFromInput = req.body.rating;

	// if findByIdAndUpdate() should return the updated book -> add {new: true}
	Book.findByIdAndUpdate(bookId, {
		title: titleFromInput,
		description: descriptionFromInput,
		author: authorFromInput,
		rating: ratingFromInput
	}, { new: true })
		.then(updatedBook => {
			console.log(updatedBook);
			// redirect to the details route
			res.redirect(`/books/${updatedBook._id}`);
		})
		.catch(err => {
			next(err);
		})
});

router.get('/books/delete/:id', (req, res, next) => {
	const bookId = req.params.id;
	Book.findByIdAndDelete(bookId)
		.then(() => {
			// redirect to the books list	
			res.redirect('/books');
		})
		.catch(err => {
			next(err);
		})
});



module.exports = router;