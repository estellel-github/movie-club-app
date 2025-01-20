import type { Request, Response, NextFunction } from "express";
import { MovieService } from "@/services/movie.service.js";
import { CustomError } from "@/utils/customError.js";

const movieService = new MovieService();

export const getAllMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movies = await movieService.getAllMovies();
    if (!movies || movies.length === 0) {
      throw new CustomError("No movies found", 404);
    }
    res.status(200).json(movies);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve movies", 500),
    );
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) {
      throw new CustomError("Movie not found", 404);
    }
    res.status(200).json(movie);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to retrieve the movie", 500),
    );
  }
};

export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user.user_id) {
      throw new CustomError("Unauthorized", 401);
    }
    const user_id = req.user.user_id;
    const movie = await movieService.createMovie(req.body, user_id);
    res.status(201).json(movie);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to create the movie", 500),
    );
  }
};

export const updateMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body);
    if (!movie) {
      throw new CustomError(`No existing movie with id ${req.params.id}`, 404);
    }
    res.status(200).json(movie);
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to update the movie", 500),
    );
  }
};

export const deleteMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await movieService.deleteMovie(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Failed to delete the movie", 500),
    );
  }
};
