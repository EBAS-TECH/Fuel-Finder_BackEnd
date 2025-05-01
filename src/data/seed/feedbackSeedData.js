import pool from "../../config/db.js";

async function createSeedFeedbacks() {
  const feedbacks = [
    {
      id: 'a1b2c3d4-0001-4a8b-b001-111122223333',
      user_id: '02d55131-3cd0-4580-956d-577e2f3df462',
      station_id: '3fba2e45-c503-4f72-b1fc-c51ac3bfa65a',
      rating: 5,
      comment: 'Excellent fuel service!'
    },
    {
      id: 'a1b2c3d4-0002-4a8b-b002-111122223333',
      user_id: '12d55131-3cd0-4580-956d-577e2f3df472',
      station_id: 'a3f72ad2-9e87-43fa-b282-f712a3d31e94',
      rating: 4,
      comment: 'Clean and well organized.'
    },
    {
      id: 'a1b2c3d4-0003-4a8b-b003-111122223333',
      user_id: '55555131-3cd0-4580-956d-577e2f3df472',
      station_id: 'd04d18b3-97f3-45a7-8ec6-6e04f7c457b6',
      rating: 3,
      comment: 'Sometimes has long queues.'
    },
    {
      id: 'a1b2c3d4-0004-4a8b-b004-111122223333',
      user_id: '02d55131-3cd0-4580-956d-577e2f3df462',
      station_id: '21266a93-3431-4f9e-b5cf-dafc7b16e3a0',
      rating: 5,
      comment: 'Quick refueling experience.'
    },
    {
      id: 'a1b2c3d4-0005-4a8b-b005-111122223333',
      user_id: '12d55131-3cd0-4580-956d-577e2f3df472',
      station_id: '1c28c6f4-2ff5-497b-9cfb-5d6078f1b3de',
      rating: 2,
      comment: 'Staff not friendly.'
    },
    {
      id: 'a1b2c3d4-0006-4a8b-b006-111122223333',
      user_id: '55555131-3cd0-4580-956d-577e2f3df472',
      station_id: '5b421a75-d195-4e8e-84c7-967f20b2a1b1',
      rating: 4,
      comment: 'Good accessibility.'
    },
    {
      id: 'a1b2c3d4-0007-4a8b-b007-111122223333',
      user_id: '02d55131-3cd0-4580-956d-577e2f3df462',
      station_id: '03ac2c68-9604-4b04-bdb6-bebf6ed3421a',
      rating: 3,
      comment: 'Sometimes out of fuel.'
    },
    {
      id: 'a1b2c3d4-0008-4a8b-b008-111122223333',
      user_id: '12d55131-3cd0-4580-956d-577e2f3df472',
      station_id: 'abb2d7f1-e3b9-490d-a75b-9c980f318f78',
      rating: 5,
      comment: 'Highly recommended station.'
    },
    {
      id: 'a1b2c3d4-0009-4a8b-b009-111122223333',
      user_id: '55555131-3cd0-4580-956d-577e2f3df472',
      station_id: '9c9b8e96-d710-4d43-9b02-bc0c7b22ab94',
      rating: 4,
      comment: 'Well lit and secure.'
    },
    {
      id: 'a1b2c3d4-0010-4a8b-b010-111122223333',
      user_id: '02d55131-3cd0-4580-956d-577e2f3df462',
      station_id: 'd838456d-e6fb-4575-8aeb-1f8581182063',
      rating: 5,
      comment: 'Open 24/7 — great!'
    }
  ];

  try {
    for (const fb of feedbacks) {
      await pool.query(
        `INSERT INTO feedbacks (id, user_id, station_id, rating, comment, updated_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [fb.id, fb.user_id, fb.station_id, fb.rating, fb.comment]
      );
    }
    console.log('✅ Feedbacks inserted successfully.');
  } catch (err) {
    // console.error('❌ Error inserting feedbacks:', err);
  } 
}

export default createSeedFeedbacks;
