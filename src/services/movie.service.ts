import type { Repository } from "typeorm";
import { AppDataSource } from "../config/database.js";
import { Movie } from "../models/movie.entity.js";
import { User } from "../models/user.entity.js";

export class MovieService {
  private movieRepo: Repository<Movie>;

  constructor() {
    this.movieRepo = AppDataSource.getRepository(Movie);
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.movieRepo.find({ relations: ["added_by"] });
  }

  async getMovieById(movie_id: string): Promise<Movie | null> {
    return this.movieRepo.findOne({
      where: { movie_id },
      relations: ["added_by"],
    });
  }

  async createMovie(data: Partial<Movie>, user_id: string): Promise<Movie> {
    const user = await AppDataSource.getRepository(User).findOneBy({ user_id });
    if (!user) {
      throw new Error("User not found");
    }
    const movie = this.movieRepo.create({ ...data, added_by_user_id: user_id });
    return this.movieRepo.save(movie);
  }

  async updateMovie(movie_id: string, data: Partial<Movie>): Promise<Movie> {
    const movie = await this.movieRepo.findOneBy({ movie_id });
    if (!movie) throw new Error("Movie not found");

    Object.assign(movie, data);
    return this.movieRepo.save(movie);
  }

  async deleteMovie(movie_id: string): Promise<void> {
    const result = await this.movieRepo.delete(movie_id);
    if (result.affected === 0) throw new Error("Movie not found");
  }
}
