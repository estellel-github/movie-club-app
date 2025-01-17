import type { Request, Response } from "express";
import { MovieService } from "../services/movie.service.js";

const movieService = new MovieService();

export const getAllMovies = async (req: Request, res: Response) => {
  const movies = await movieService.getAllMovies();
  res.status(200).json(movies);
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json(movie);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

interface CustomRequest extends Request {
  user?: {
    user_id: string;
  };
}

export const createMovie = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user_id = req.user.user_id;
    const movie = await movieService.createMovie(req.body, user_id);
    res.status(201).json(movie);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body);
    res.status(200).json(movie);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    await movieService.deleteMovie(req.params.id);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};
