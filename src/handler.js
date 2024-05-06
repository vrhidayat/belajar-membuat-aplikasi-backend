const { nanoid } = require("nanoid");
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const isSuccess = books.filter((note) => note.id === id).length > 0;
    const finished = pageCount === readPage;

    if (!name) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku'
            })
            .code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400);
        return response;
    }

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt
    };

    books.push(newBook);

    if (isSuccess) {
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            })
            .code(201);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Gagal menambahkan buku'
        })
        .code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (!name && !reading && !finished) {
        const response = h
            .response({
                status: 'success',
                data: {
                    books: books.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
                }
            })
            .code(200);
        return response;
    }

    if (name) {
        const filteredBooksName = books.filter((book) => {
            const nameRegex = new RegExp(name, 'gi');
            return nameRegex.test(book.name);
        });

        const response = h
            .response({
                status: 'success',
                data: {
                    books: filteredBooksName.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
                }
            })
            .code(200);
        return response;
    }

    if (reading) {
        const filteredBooksReading = books.filter((book) => Number(book.reading) === Number(reading));

        const response = h
            .response({
                status: 'success',
                data: {
                    books: filteredBooksReading.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
                }
            })
            .code(200);
        return response;
    }

    const filteredBooksFinished = books.filter((book) => Number(book.finished) === Number(finished));

    const response = h
        .response({
            status: 'success',
            data: {
                books: filteredBooksFinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        .code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book) {
        const response = h.
            response({
                status: 'success',
                data: {
                    book,
                }
            })
            .code(200);
        return response;
    }


    const response = h
        .response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        .code = 404;
    return response;
}

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    const index = books.findIndex((book) => book.id === id);

    if (!name) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku'
            })
            .code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400);
        return response;
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            })
            .code(200);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil dihapus',
            })
            .code(200);
        return response;
    }
    const response = h
        .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};
