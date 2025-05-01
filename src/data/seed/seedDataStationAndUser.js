import pool from "../../config/db.js";

// Pre-generated UUIDs for users and stations
const users = [
  {
    id: "fbb82c6a-b69b-4d8c-b10c-3b24aaf0c500", 
    first_name: "Station", 
    last_name: "Owner 1", 
    username: "stationowner11", 
    email: "owner11@station.com"
  },
  {
    id: "87bfd025-0415-4679-a7db-0c4d73e275af", 
    first_name: "Station", 
    last_name: "Owner 2", 
    username: "stationowner12", 
    email: "owner12@station.com"
  },
  {
    id: "80de28ce-e743-49d9-86a8-10bb078ed566", 
    first_name: "Station", 
    last_name: "Owner 3", 
    username: "stationowner3", 
    email: "owner3@station.com"
  },
  {
    id: "72d55131-3cd0-4580-956d-577e2f3df46c", 
    first_name: "Station", 
    last_name: "Owner 4", 
    username: "stationowner4", 
    email: "owner4@station.com"
  },
  {
    id: "c4c6b85d-9bb7-4b79-8a0f-fd9d8ad9d02a", 
    first_name: "Station", 
    last_name: "Owner 5", 
    username: "stationowner5", 
    email: "owner5@station.com"
  },
  {
    id: "f29b61c3-c83e-49b3-83b1-2e8b576fa26d", 
    first_name: "Station", 
    last_name: "Owner 6", 
    username: "stationowner6", 
    email: "owner6@station.com"
  },
  {
    id: "a9ff3958-8f9d-47ea-b4ad-04bcdf684bc0", 
    first_name: "Station", 
    last_name: "Owner 7", 
    username: "stationowner7", 
    email: "owner7@station.com"
  },
  {
    id: "64be1a1d-0c69-4f61-92d4-c9f0572b6fbc", 
    first_name: "Station", 
    last_name: "Owner 8", 
    username: "stationowner8", 
    email: "owner8@station.com"
  },
  {
    id: "e87a0225-1b5f-4fd0-b1b2-4f15f05f1e09", 
    first_name: "Station", 
    last_name: "Owner 9", 
    username: "stationowner9", 
    email: "owner9@station.com"
  },
  {
    id: "4d4f63d0-d9fd-4722-b8ec-c17fe40a1cc7", 
    first_name: "Station", 
    last_name: "Owner 10", 
    username: "stationowner10", 
    email: "owner10@station.com"
  }
];

const stations = [
  { id: "3fba2e45-c503-4f72-b1fc-c51ac3bfa65a", en_name: "Station 1", am_name: "ጣቢያ 1",tin_number:"0000000001", address: "Street 1, Addis Ababa", user_id: "fbb82c6a-b69b-4d8c-b10c-3b24aaf0c500" },
  { id: "a3f72ad2-9e87-43fa-b282-f712a3d31e94", en_name: "Station 2", am_name: "ጣቢያ 2",tin_number:"0000000002", address: "Street 2, Addis Ababa", user_id: "87bfd025-0415-4679-a7db-0c4d73e275af" },
  { id: "d04d18b3-97f3-45a7-8ec6-6e04f7c457b6", en_name: "Station 3", am_name: "ጣቢያ 3",tin_number:"0000000003", address: "Street 3, Addis Ababa", user_id: "80de28ce-e743-49d9-86a8-10bb078ed566" },
  { id: "21266a93-3431-4f9e-b5cf-dafc7b16e3a0", en_name: "Station 4", am_name: "ጣቢያ 4",tin_number:"0000000004", address: "Street 4, Addis Ababa", user_id: "72d55131-3cd0-4580-956d-577e2f3df46c" },
  { id: "1c28c6f4-2ff5-497b-9cfb-5d6078f1b3de", en_name: "Station 5", am_name: "ጣቢያ 5",tin_number:"0000000005", address: "Street 5, Addis Ababa", user_id: "c4c6b85d-9bb7-4b79-8a0f-fd9d8ad9d02a" },
  { id: "5b421a75-d195-4e8e-84c7-967f20b2a1b1", en_name: "Station 6", am_name: "ጣቢያ 6",tin_number:"0000000006", address: "Street 6, Addis Ababa", user_id: "f29b61c3-c83e-49b3-83b1-2e8b576fa26d" },
  { id: "03ac2c68-9604-4b04-bdb6-bebf6ed3421a", en_name: "Station 7", am_name: "ጣቢያ 7",tin_number:"0000000007", address: "Street 7, Addis Ababa", user_id: "a9ff3958-8f9d-47ea-b4ad-04bcdf684bc0" },
  { id: "abb2d7f1-e3b9-490d-a75b-9c980f318f78", en_name: "Station 8", am_name: "ጣቢያ 8",tin_number:"0000000008", address: "Street 8, Addis Ababa", user_id: "64be1a1d-0c69-4f61-92d4-c9f0572b6fbc" },
  { id: "9c9b8e96-d710-4d43-9b02-bc0c7b22ab94", en_name: "Station 9", am_name: "ጣቢያ 9",tin_number:"0000000009", address: "Street 9, Addis Ababa", user_id: "e87a0225-1b5f-4fd0-b1b2-4f15f05f1e09" },
  { id: "d838456d-e6fb-4575-8aeb-1f8581182063", en_name: "Station 10", am_name: "ጣቢያ 10",tin_number:"0000000010", address: "Street 10, Addis Ababa", user_id: "4d4f63d0-d9fd-4722-b8ec-c17fe40a1cc7" }
];

const createSeedUsersAndStations = async () => {
  try {
    // Seed users
    for (const user of users) {
      const { id, first_name, last_name, username, email } = user;
      await pool.query(
        `INSERT INTO users (id, first_name, last_name, username, password, email, role, profile_pic, verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id, 
          first_name, 
          last_name, 
          username, 
          "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // hashed password
          email, 
          "GAS_STATION", 
          `https://avatar.iran.liara.run/public/boy?username=${username}`,
          true
        ]
      );
    }

    // Seed stations
    for (const station of stations) {
      const { id, en_name, am_name, address, user_id,tin_number } = station;
      await pool.query(
        `INSERT INTO stations (id, en_name, am_name, tin_number, user_id, location, address,status)
         VALUES ($1, $2, $3, $4, $5, ST_GeomFromText($6, 4326), $7,$8)`,
        [
          id,
          en_name,
          am_name,
          tin_number, 
          user_id,
          `POINT(${38.75 + Math.random() * 0.1} ${9.03 + Math.random() * 0.1})`, // Random location
          address,
          "VERIFIED"
        ]
      );
    }
    console.log("✅ 10 Users and 10 Stations seeded successfully.");
  } catch (error) {
    // console.error("❌ Error seeding users and stations:", error);
  }
};

export default createSeedUsersAndStations;
