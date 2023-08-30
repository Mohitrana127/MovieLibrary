const Movie = require('../models/movieModel');
const axios = require('axios');
const apiConfig = require('../config/apiConfig');

exports.createMovie = async (req, res) => {
  try {
    const { title, genre, director } = req.body;

    if (!title || !genre || !director) {
      return res.status(400).json({ message: 'Please provide title, genre, and director for the movie.' });
    }

    const newMovie = new Movie({
      title,
      genre,
      director,
    });

    const savedMovie = await newMovie.save();

    res.status(201).json({ message: 'Movie created successfully.', movie: savedMovie });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'An error occurred while creating the movie.' });
  }
};
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error getting movies:', error);
    res.status(500).json({ message: 'Error getting movies from the database.' });
  }
};
exports.getMovieById = async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Error fetching movie' });
  }
};
exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const updatedData = req.body;

    const existingMovie = await Movie.findById(movieId);
    if (!existingMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    existingMovie.title = updatedData.title || existingMovie.title;
    existingMovie.genre = updatedData.genre || existingMovie.genre;
    existingMovie.director = updatedData.director || existingMovie.director;

    const updatedMovie = await existingMovie.save();
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Error updating the movie' });
  }
};
exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(movieId);

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Error deleting the movie' });
  }
};