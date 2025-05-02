import pool from "../../config/db.js";

async function createSeedPrice() {
    const fuelPricesData = [
      {
        id: 'd5f7b8a3-d356-4b3c-9a6d-8ff5df097029',
        fuel_type: 'DIESEL',
        price: 5000,
        created_at: '2025-04-25 08:00:00',
        updated_at: '2025-04-25 08:00:00'
      },
      {
        id: 'a4b3dce4-b37c-4231-b8c8-7e74a4d0cfdd',
        fuel_type: 'PETROL',
        price: 6000,
        created_at: '2025-04-25 08:00:00',
        updated_at: '2025-04-25 08:00:00'
      }
    ];
    try {
  
    for (const fp of fuelPricesData) {
      await pool.query(
        `INSERT INTO fuel_prices (id, fuel_type, price, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          fp.id, 
          fp.fuel_type, 
          fp.price, 
          fp.created_at, 
          fp.updated_at
        ]
      );
    }
    console.log('✅ Fuel prices data inserted successfully.');
  } catch (err) {
    // console.error('❌ Error inserting fuel prices data:', err);
  }
}

export default createSeedPrice;