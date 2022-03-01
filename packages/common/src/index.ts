import { connectDB } from './database';

connectDB();

export { IBook, BookModel } from './models/Book.model';
