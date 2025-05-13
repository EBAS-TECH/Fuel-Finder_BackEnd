import {
    getAllFuelPricesService,
    getFuelPriceByTypeService,
    updateFuelPriceService,
    deleteFuelPriceByTypeService,
    createFuelPriceService,
  } from "../service/fuelPriceService.js";
  
  export const createFuelPrice = async (req, res) => {
    try {
      const { fuel_type, price,end_date } = req.body;
      if (!fuel_type || !price) {
        return res.status(400).json({ success: false, message: "fuel_type and price are required" });
      }
      const oldPrice = await getFuelPriceByTypeService(fuel_type);
      if(oldPrice){
       
        return res.status(400).json({message:"fuel price already exist"})
      }
  
      const fuelPrice = await createFuelPriceService(fuel_type, price,end_date);
      res.status(201).json({ success: true, data: fuelPrice });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create or update fuel price", error });
    }
  };



  export const getAllFuelPrices = async (req, res) => {
    try {
      const prices = await getAllFuelPricesService();
      res.status(200).json({ success: true, data: prices });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve fuel prices", error });
    }
  };

  export const getFuelPriceByType = async (req, res) => {
    try {
      const { fuel_type } = req.params;
  
      const price = await getFuelPriceByTypeService(fuel_type);
      if (!price) {
        return res.status(404).json({ success: false, message: "Fuel type not found" });
      }
  
      res.status(200).json({ success: true, data: price });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve fuel price", error });
    }
  };
  
  
  export const updateFuelPrice = async (req, res) => {
    try {
      const { fuel_type } = req.params;
      const { price ,end_date} = req.body;
  
      const updated = await updateFuelPriceService(fuel_type, price,end_date);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Fuel type not found" });
      }
  
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update fuel price", error });
    }
  };

  
  export const deleteFuelPriceByType = async (req, res) => {
    try {
      const { fuel_type } = req.params;
  
      const deleted = await deleteFuelPriceByTypeService(fuel_type);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Fuel type not found" });
      }
  
      res.status(200).json({ success: true,message: "Fuel price deleted successfully", data: deleted });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete fuel price", error });
    }
  };
  