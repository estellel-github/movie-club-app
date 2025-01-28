import { faker } from "@faker-js/faker";
import argon2 from "argon2";
import { AppDataSource } from "./database.js";
import { User } from "../models/user.entity.js";
import { Movie } from "../models/movie.entity.js";
import { Event } from "../models/event.entity.js";
import { Comment } from "../models/comment.entity.js";
import { rsvpStatuses, RSVP } from "../models/rsvp.entity.js";
import type { DeepPartial } from "typeorm";

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("🔗 Database connected for seeding.");

    const userRepo = AppDataSource.getRepository(User);
    const movieRepo = AppDataSource.getRepository(Movie);
    const eventRepo = AppDataSource.getRepository(Event);
    const commentRepo = AppDataSource.getRepository(Comment);
    const rsvpRepo = AppDataSource.getRepository(RSVP);

    const isDatabaseSeeded = async () => {
      const userCount = await userRepo.count();
      return userCount > 0;
    };

    if (await isDatabaseSeeded()) {
      console.log("🚨 Database already seeded. No changes made.");
      process.exit(0);
    }

    const predefinedPassword = process.env.SEED_PASSWORD || "Test@123";

    // Seed Users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const hashedPassword = await argon2.hash(predefinedPassword);
      const user = userRepo.create({
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: hashedPassword,
        intro_msg: faker.lorem.sentence(),
      });
      users.push(await userRepo.save(user));
    }
    console.log(
      `✅ ${users.length} Users seeded with default password: ${predefinedPassword}`,
    );

    // Seed Movies
    const movies = [];
    for (let i = 0; i < 50; i++) {
      const movie = movieRepo.create({
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        director: faker.person.fullName(),
        release_year: faker.date.past().getFullYear(),
        genre: faker.helpers.arrayElement(["Drama", "Comedy", "Action"]),
        language: faker.helpers.arrayElement(["English", "French", "Spanish"]),
        runtime_minutes: faker.number.int({ min: 1, max: 500 }),
        added_by_user_id:
          users[faker.number.int({ min: 0, max: users.length - 1 })].user_id,
      });
      movies.push(await movieRepo.save(movie));
    }
    console.log(`✅ ${movies.length} Movies seeded.`);

    // Seed Events
    const events = [];
    for (let i = 0; i < 15; i++) {
      const event = eventRepo.create({
        title: faker.lorem.words(3),
        description: faker.lorem.sentences(2),
        date: faker.date.future(),
        location: faker.location.city(),
        movie_id:
          movies[faker.number.int({ min: 0, max: movies.length - 1 })].movie_id,
        host_id:
          users[faker.number.int({ min: 0, max: users.length - 1 })].user_id,
        max_attendees: faker.number.int({ min: 5, max: 15 }),
      });
      events.push(await eventRepo.save(event));
    }
    console.log(`✅ ${events.length} Events seeded.`);

    // Seed RSVPs
    const rsvps = [];
    for (const event of events) {
      let currentPriority = 1;
      const maxAttendees = event.max_attendees;

      const totalRsvps = faker.number.int({
        min: maxAttendees,
        max: maxAttendees + 10,
      });

      for (let i = 0; i < totalRsvps; i++) {
        const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
        let status: string;
        if (currentPriority <= maxAttendees) {
          status = rsvpStatuses[0];
        } else {
          status = faker.helpers.arrayElement([
            rsvpStatuses[1],
            rsvpStatuses[2],
          ]);
        }

        const rsvp = rsvpRepo.create({
          event_id: event.event_id,
          user_id: user.user_id,
          status: status,
          priority: currentPriority,
        } as DeepPartial<RSVP>);
        rsvps.push(await rsvpRepo.save(rsvp));
        currentPriority++;
      }
    }
    console.log(`✅ ${rsvps.length} RSVPs seeded.`);

    // Seed Comments
    const comments = [];
    for (const event of events) {
      for (let i = 0; i < faker.number.int({ min: 3, max: 10 }); i++) {
        const comment = commentRepo.create({
          event_id: event.event_id,
          user_id:
            users[faker.number.int({ min: 0, max: users.length - 1 })].user_id,
          content: faker.lorem.sentences(2),
        });
        comments.push(await commentRepo.save(comment));
      }
    }
    console.log(`✅ ${comments.length} Comments seeded.`);

    await AppDataSource.destroy();
    console.log("🌱 Seeding completed. Database is ready for use!");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    await AppDataSource.destroy();
    process.exit(1);
  }
};

seedDatabase();
