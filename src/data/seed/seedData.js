

import pool from "../../config/db.js";


const createSeedUsers = async () => {
  const users = [
    {
      id: "fbb82c6a-b69b-4d8c-b10c-3b24aaf0c598",
      first_name: "Fuel",
      last_name: "Minister",
      username: "fuelminister",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // hashed
      email: "minister@fuel.gov",
      role: "MINISTRY_DELEGATE", // ensure this exists in your user_role enum
      profile_pic: `https://avatar.iran.liara.run/public/boy?username=fuelminister`,
      verified: true,
    },
    {
      id: "88bfd025-0415-4679-a7db-0c4d73e275af",
      first_name: "Station",
      last_name: "Owner",
      username: "stationowner",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W",
      email: "owner@station.com",
      role: "GAS_STATION",
      profile_pic: `https://avatar.iran.liara.run/public/boy?username=stationowner`,
      verified: true,
    },
    {
      id: "8bde28ce-e743-49d9-86a8-10bb078ed566",
      first_name: "Admin",
      last_name: "Admin",
      username: "adminuser",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // hashed
      email: "admin@admin.com",
      role: "ADMIN", 
      profile_pic: `https://avatar.iran.liara.run/public/boy?username=adminuser`,
      verified: true,
    },
    {
      id: "72d55131-3cd0-4580-956d-577e2f3df462",
      first_name: "John",
      last_name: "Doe",
      username: "driverjohn",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // hashed
      email: "john.doe@driver.com",
      role: "DRIVER", 
      profile_pic: `https://avatar.iran.liara.run/public/boy?username=driverjohn`,
      verified: true,
    },
    {
      id: "02d55131-3cd0-4580-956d-577e2f3df462",
      first_name: "Alice",
      last_name: "Driver",
      username: "driveralice",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // same hashed password
      email: "alice.driver@driver.com",
      role: "DRIVER",
      profile_pic: `https://avatar.iran.liara.run/public/girl?username=driveralice`,
      verified: true,
    },
    {
      id: "12d55131-3cd0-4580-956d-577e2f3df472",
      first_name: "Bob",
      last_name: "Driver",
      username: "driverbob",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // same hashed password
      email: "bob.driver@driver.com",
      role: "DRIVER",
      profile_pic: `https://avatar.iran.liara.run/public/girl?username=driverbob`,
      verified: true,
    },
    {
      id: "55555131-3cd0-4580-956d-577e2f3df472",
      first_name: "Petty",
      last_name: "Driver",
      username: "driverPetty",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // same hashed password
      email: "Petty.driver@driver.com",
      role: "DRIVER",
      profile_pic: `https://avatar.iran.liara.run/public/girl?username=driverPetty`,
      verified: true,
    },
    {
      id: "11d55131-3cd0-4580-956d-577e2f3df445",
      first_name: "Bob",
      last_name: "Station",
      username: "stationbob",
      password: "$2b$10$VdMsSaZ3ye4BRcBweFtZgeMR6LwwcZiN8n0zMXLcWRN2KWb4eBe9W", // same hashed password
      email: "bob.station@gas.com",
      role: "GAS_STATION",
      profile_pic: `https://avatar.iran.liara.run/public/boy?username=stationbob`,
      verified: true,
    },
  ];

  try {
    for (const user of users) {
      const { id, first_name, last_name, username, password, email, role, profile_pic, verified } = user;
      await pool.query(
        `INSERT INTO users (
          id, first_name, last_name, username, password, email, role, profile_pic, verified
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, first_name, last_name, username, password, email, role, profile_pic, verified]
      );
    }
    // console.log("✅ Users seeded successfully.");
  } catch (error) {
    // console.error("users are cre", error);
  }
};

export default createSeedUsers;
