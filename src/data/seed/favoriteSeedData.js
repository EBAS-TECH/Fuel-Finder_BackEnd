import pool from "../../config/db.js";

async function createSeedFavorites() {
    const favorites = [
      { id: "b101d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "02d55131-3cd0-4580-956d-577e2f3df462", station_id: "3fba2e45-c503-4f72-b1fc-c51ac3bfa65a" },
      { id: "b201d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "02d55131-3cd0-4580-956d-577e2f3df462", station_id: "a3f72ad2-9e87-43fa-b282-f712a3d31e94" },
      { id: "b301d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "12d55131-3cd0-4580-956d-577e2f3df472", station_id: "d04d18b3-97f3-45a7-8ec6-6e04f7c457b6" },
      { id: "b401d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "12d55131-3cd0-4580-956d-577e2f3df472", station_id: "21266a93-3431-4f9e-b5cf-dafc7b16e3a0" },
      { id: "b501d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "55555131-3cd0-4580-956d-577e2f3df472", station_id: "5b421a75-d195-4e8e-84c7-967f20b2a1b1" },
      { id: "b601d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "55555131-3cd0-4580-956d-577e2f3df472", station_id: "abb2d7f1-e3b9-490d-a75b-9c980f318f78" },
      { id: "b701d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "02d55131-3cd0-4580-956d-577e2f3df462", station_id: "1c28c6f4-2ff5-497b-9cfb-5d6078f1b3de" },
      { id: "b801d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "12d55131-3cd0-4580-956d-577e2f3df472", station_id: "03ac2c68-9604-4b04-bdb6-bebf6ed3421a" },
      { id: "b901d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "55555131-3cd0-4580-956d-577e2f3df472", station_id: "9c9b8e96-d710-4d43-9b02-bc0c7b22ab94" },
      { id: "bA01d6a4-fb1a-457a-8d82-0010a83c0123", user_id: "02d55131-3cd0-4580-956d-577e2f3df462", station_id: "d838456d-e6fb-4575-8aeb-1f8581182063" },
    ];

    try {
      for (const fav of favorites) {
        await pool.query(
          `INSERT INTO favorites (id, user_id, station_id) VALUES ($1, $2, $3)`,
          [fav.id, fav.user_id, fav.station_id]
        );
      }
      console.log('✅ Favorite seed data inserted successfully');
    } catch (err) {
    //   console.error('❌ Error inserting favorite data:', err);
    } 
  }
  
  export default createSeedFavorites;