import { Between, Like } from "typeorm";
import type { Repository, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "@/config/database.js";
import { Movie } from "@/models/movie.entity.js";
import { CustomError } from "@/utils/customError.js";
import { ActivityLogService } from "@/services/activity.service.js";

export class MovieService {
  private movieRepo: Repository<Movie>;
  private activityLogService: ActivityLogService;

  constructor() {
    this.movieRepo = AppDataSource.getRepository(Movie);
    this.activityLogService = new ActivityLogService();
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

  async getMoviesWithFilters(
    page: number,
    limit: number,
    filters: {
      title?: string;
      director?: string;
      genre?: string;
      language?: string;
      releaseYearStart?: number;
      releaseYearEnd?: number;
      runtimeMin?: number;
      runtimeMax?: number;
    },
  ) {
    try {
      const where: FindOptionsWhere<Movie> = {};

      // Filters
      if (filters.title) {
        where.title = Like(`%${filters.title}%`);
      }
      if (filters.director) {
        where.director = Like(`%${filters.director}%`);
      }
      if (filters.genre) {
        where.genre = Like(`%${filters.genre}%`);
      }
      if (filters.language) {
        where.language = Like(`%${filters.language}%`);
      }
      if (filters.releaseYearStart || filters.releaseYearEnd) {
        where.release_year = Between(
          filters.releaseYearStart || 1900, // Default to earliest possible year
          filters.releaseYearEnd || new Date().getFullYear(), // Default to current year
        );
      }
      if (filters.runtimeMin || filters.runtimeMax) {
        where.runtime_minutes = Between(
          filters.runtimeMin || 1, // Default to minimum runtime
          filters.runtimeMax || 1000, // Default to maximum runtime
        );
      }

      // Query with pagination
      const [movies, total] = await this.movieRepo.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      return { movies, total, page, limit };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError("Failed to fetch movies with filters", 500);
    }
  }

  async createMovie(data: Partial<Movie>, user_id: string): Promise<Movie> {
    try {
      const movie = this.movieRepo.create({
        ...data,
        added_by_user_id: user_id,
      });
      const savedMovie = await this.movieRepo.save(movie);

      await this.activityLogService.logMovieCreated(
        savedMovie.movie_id,
        savedMovie.title,
      );

      return savedMovie;
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
