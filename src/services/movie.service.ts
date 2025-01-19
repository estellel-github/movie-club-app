import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Movie } from "../models/movie.entity.js";
import { CustomError } from "../utils/customError.js";

export class MovieService {
  private movieRepo: Repository<Movie>;

  constructor() {
    this.movieRepo = AppDataSource.getRepository(Movie);
  }

  async getAllMovies(): Promise<Movie[]> {
    try {
      const movies = await this.movieRepo.find();
      return movies;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve movies", 500);
    }
  }

  async getMovieById(movie_id: string): Promise<Movie | null> {
    try {
      const movie = await this.movieRepo.findOneBy({ movie_id });
      if (!movie) {
        throw new CustomError("Movie not found", 404);
      }
      return movie;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to retrieve movie", 500);
    }
  }

  async createMovie(data: Partial<Movie>, user_id: string): Promise<Movie> {
    try {
      const movie = this.movieRepo.create({
        ...data,
        added_by_user_id: user_id,
      });
      return await this.movieRepo.save(movie);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to create movie", 500);
    }
  }

  async updateMovie(movie_id: string, data: Partial<Movie>): Promise<Movie> {
    try {
      const movie = await this.movieRepo.findOneBy({ movie_id });
      if (!movie) {
        throw new CustomError("Movie not found", 404);
      }

      Object.assign(movie, data);
      return await this.movieRepo.save(movie);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to update movie", 500);
    }
  }

  async deleteMovie(movie_id: string): Promise<void> {
    try {
      const result = await this.movieRepo.delete(movie_id);
      if (result.affected === 0) {
        throw new CustomError("Movie not found", 404);
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to delete movie", 500);
    }
  }
}
