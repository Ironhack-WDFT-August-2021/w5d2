const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema({
	title: String,
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'Author'
	},
	reviews: [
		{
			user: String,
			text: String,
			// this object will not get a mongo object id
			// _id: false
		}
	],
	rating: Number
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
