import pool from "../../config/db.js";

async function createSeedFuelAvailable() {
const fuelAvailabilityData = [
    {
      id: 'a1e3bfc0-2a8a-4c8b-b674-bba4f734f785',
      station_id: '3fba2e45-c503-4f72-b1fc-c51ac3bfa65a',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 08:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'e45bdb87-7e55-4fd5-9b9b-fc51c85b90bc',
      station_id: '3fba2e45-c503-4f72-b1fc-c51ac3bfa65a',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 08:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'f575cd16-7b68-49f9-8a2b-d5e3b5c72223',
      station_id: 'a3f72ad2-9e87-43fa-b282-f712a3d31e94',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 09:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'fc56be1e-cda7-4e1b-8c96-7428004d342b',
      station_id: 'a3f72ad2-9e87-43fa-b282-f712a3d31e94',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 09:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'b95789e3-e0d4-4f8e-bad4-5351a9ebdf80',
      station_id: 'd04d18b3-97f3-45a7-8ec6-6e04f7c457b6',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 10:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'a27f2c52-9c9e-4b89-a07f-40a1e6d6ae9d',
      station_id: 'd04d18b3-97f3-45a7-8ec6-6e04f7c457b6',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 10:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'd4b56893-b8da-4df2-8d26-f0a01e25766a',
      station_id: '21266a93-3431-4f9e-b5cf-dafc7b16e3a0',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 11:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: '63a3db95-1b79-47fe-9c0d-74c4555785b0',
      station_id: '21266a93-3431-4f9e-b5cf-dafc7b16e3a0',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 11:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: '8fbd78b2-d3ae-4085-a179-cf6f95e2647d',
      station_id: '1c28c6f4-2ff5-497b-9cfb-5d6078f1b3de',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 12:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: '3f515f43-9b0e-4d12-b3de-cf5f45d92907',
      station_id: '1c28c6f4-2ff5-497b-9cfb-5d6078f1b3de',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 12:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: '45d8e60a-c0d2-4685-a24f-e1077c7dbaad',
      station_id: '5b421a75-d195-4e8e-84c7-967f20b2a1b1',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 13:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'bdfed5b1-8392-40d5-b702-967f78e0e20f',
      station_id: '5b421a75-d195-4e8e-84c7-967f20b2a1b1',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 13:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'c5a9e96f-225d-4d1a-bc92-123a528da569',
      station_id: '03ac2c68-9604-4b04-bdb6-bebf6ed3421a',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 14:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'd3e60a28-5941-400b-8036-b1fa80d3c804',
      station_id: '03ac2c68-9604-4b04-bdb6-bebf6ed3421a',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 14:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: '3f574b9e-d6b7-4708-b61c-37b5b9f22632',
      station_id: 'abb2d7f1-e3b9-490d-a75b-9c980f318f78',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 15:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'cb106503-0868-49c5-8e2f-5ed5f8c1058d',
      station_id: 'abb2d7f1-e3b9-490d-a75b-9c980f318f78',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 15:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'd3e96a56-57e0-421f-8f43-3c930dc37293',
      station_id: '9c9b8e96-d710-4d43-9b02-bc0c7b22ab94',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 16:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: '4f1cf92f-8c88-4b6e-8a32-1d9ecf8e5e1e',
      station_id: '9c9b8e96-d710-4d43-9b02-bc0c7b22ab94',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 16:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: '7e453c4f-d957-40ab-b421-49103bfe08a4',
      station_id: 'd838456d-e6fb-4575-8aeb-1f8581182063',
      fuel_type: 'DIESEL',
      up_time: '2025-04-25 17:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    },
    {
      id: 'b27f503f-4103-408d-b156-34466cc2a64a',
      station_id: 'd838456d-e6fb-4575-8aeb-1f8581182063',
      fuel_type: 'PETROL',
      up_time: '2025-04-25 17:00:00',
      down_time: null, // available = TRUE
      availability_duration: null,
      available: true
    }
  ];
  try{

    for (const fa of fuelAvailabilityData) {
        await pool.query(
          `INSERT INTO fuel_availability (id, station_id, fuel_type, up_time, down_time, availability_duration, available)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            fa.id, 
            fa.station_id, 
            fa.fuel_type, 
            fa.up_time, 
            fa.down_time, 
            fa.availability_duration, 
            fa.available
          ]
        );
      }
      console.log('✅ Fuel availability data inserted successfully.');
    } catch (err) {
    //   console.error('❌ Error inserting fuel availability data:', err);
    }
  
}
export default createSeedFuelAvailable;