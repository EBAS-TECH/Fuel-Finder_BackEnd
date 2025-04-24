
import pool from "../config/db.js";
import createStationTable from "./stationTable.js";
import createUserTable from "./userTable.js";
import createEmailVerificationTable from "./Emailverification.js";
import enablePostGIS  from "./enablePostGis.js";

const setupDatabase = async () => {
  try {
    console.log(" Setting up the database...");
    await enablePostGIS();
    await createUserTable();
    await createEmailVerificationTable();
    await createStationTable();
    console.log(" Database setup complete!");
  } catch (err) {
    console.error(" Error setting up database:", err);
  } 
};

export default setupDatabase;


