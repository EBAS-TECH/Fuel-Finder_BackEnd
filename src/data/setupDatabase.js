
import pool from "../config/db.js";
import createStationTable from "./stationTable.js";
import createUserTable from "./userTable.js";
import createEmailVerificationTable from "./Emailverification.js";
import enablePostGIS  from "./enablePostGis.js";
import createFuelAvailabilityTable from "./fuelAvailability.js";
import createfeedbackTable from "./FeedbackTable.js";
import createfavoriteTable from "./favoriteTable.js";
import createFuelPriceTable from "./fuelPriceTable.js";
import createSeedUsers from "./seed/seedData.js"
import createSeedUsersAndStations from "./seed/seedDataStationAndUser.js";
// import seedFavorites from "./seed/favoriteSeedDate.js";


const setupDatabase = async () => {
  try {
    console.log(" Setting up the database...");
    await enablePostGIS();
    await createUserTable();
    await createEmailVerificationTable();
    await createStationTable();
    await createFuelAvailabilityTable();
    await createfeedbackTable();
    await createfavoriteTable();
    await createFuelPriceTable();
    await createSeedUsers();
    await createSeedUsersAndStations();
    // await seedFavorites();

    console.log(" Database setup complete!");
  } catch (err) {
    console.error(" Error setting up database:", err);
  } 
};

export default setupDatabase;


