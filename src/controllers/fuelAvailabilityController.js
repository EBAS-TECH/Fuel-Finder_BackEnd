import bcrypt from "bcryptjs";
import { validate as isUUID } from "uuid";
import { createFuelAvailabilityService,
     deleteFuelAvailabilityByIdService,
    getAllFuelAvailabilitiesService, 
    getFuelAvailabilityByFuelTypeAndAvailabilityService, 
    getFuelAvailabilityByStationAndFuelTypeService, 
    getFuelAvailabilityByStationIdService, 
    updateFuelAvailabilityByIdService,
    getFuelAvailabilityByIdService,
    getLastFuelAvailabilityByStationAndFuelTypeService, 
    getAllAvailabilityHours} from "../service/fuelAvailabilityService.js";
import { getStationByUserId } from "./stationController.js";
import { getStationByUserIdService } from "../service/stationService.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
      status,
      message,
      data,
    });
  };

  export const createFuelAvailability = async (req, res) => {

    try {
      const { station_id, fuel_type} = req.body;
      
        const fuelAvailabilityOld = await getLastFuelAvailabilityByStationAndFuelTypeService(station_id,fuel_type,);
    
        if (fuelAvailabilityOld?.available) {
          return handleResponse(res, 404, "there is available fuel can no start fuel", null);
        }
      const fuelAvailability = await createFuelAvailabilityService(
        station_id,
        fuel_type,
      );
  
      return res.status(201).json({ message: "Fuel availability created successfully", data: fuelAvailability });
    } catch (error) {
      console.error("Error creating fuel availability:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const getAllFuelAvailabilities = async (req, res, next) => {
      try {
        const fuelAvailability = await getAllFuelAvailabilitiesService();
        
        if (fuelAvailability.length === 0) {
          return handleResponse(res, 200, "No Availability found", fuelAvailability);
        }
        handleResponse(res, 200, "Fuel Availabilities retrieved successfully", fuelAvailability);
     
      } catch (err) {
        next(err);
      }
    };

    export const getFuelAvailabilitiesById = async (req, res, next) => {
        if (!isUUID(req.params.id)) {
            return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
          }
        const { id } = req.params;
      
        try {
          const fuelAvailability = await getFuelAvailabilityByIdService(id);
      
          if (!fuelAvailability) {
            return handleResponse(res, 404, "No Availability found with station", null);
          }
      
          handleResponse(res, 200, "Fuel Availability retrieved successfully", fuelAvailability);
        } catch (err) {
          next(err);
        }
      };

    export const getFuelAvailabilitiesByStationId = async (req, res, next) => {
        if (!isUUID(req.params.id)) {
            return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
          }
        const { id } = req.params;
      
        try {
          const fuelAvailability = await getFuelAvailabilityByStationIdService(id);
      
          if (!fuelAvailability) {
            return handleResponse(res, 404, "No Availability found with station", null);
          }
      
          handleResponse(res, 200, "Fuel Availability retrieved successfully", fuelAvailability);
        } catch (err) {
          next(err);
        }
      };

       export const deleteFuelAvailabilityById = async (req, res, next) => {
          if (!isUUID(req.params.id)) {
              return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
            }
          const { id } = req.params;
        
          try {
            const fuelAvailability = await deleteFuelAvailabilityByIdService(id);
        
            if (!fuelAvailability) {
              return handleResponse(res, 404, "Station not found", null);
            }
        
            handleResponse(res, 200, "fuelAvailability deleted successfully", fuelAvailability);
          } catch (err) {
            next(err);
          }
        };

        export const updateFuelAvailabilityById = async (req, res, next) => {
            if (!isUUID(req.params.id)) {
              return res.status(400).json({ error: "Invalid ID: not a valid UUID" });
            }
          
            const { id } = req.params;
            const fuel_type = req.body.fuel_type;
          console.log(id,fuel_type)
            try {
              const updatedFuelAvailability = await updateFuelAvailabilityByIdService(id,fuel_type);
          
              if (!updatedFuelAvailability) {
                return handleResponse(res, 404, "Fuel availability not found", null);
              }
          
              handleResponse(res, 200, "Fuel availability off successfully", updatedFuelAvailability);
            } catch (err) {
              next(err);
            }
          };


          export const getFuelAvailabilityByStationAndFuelType = async (req, res, next) => {
            const { station_id, fuel_type } = req.params;
          
            if (!isUUID(station_id)) {
              return res.status(400).json({ error: "Invalid station_id: not a valid UUID" });
            }
          
            try {
              const fuelAvailability = await getFuelAvailabilityByStationAndFuelTypeService(station_id, fuel_type);
          
              if (fuelAvailability.length === 0) {
                return handleResponse(res, 404, "Fuel availability not found for the specified station and fuel type", null);
              }
          
              handleResponse(res, 200, "Fuel availability retrieved successfully", fuelAvailability);
            } catch (err) {
              next(err);
            }
          };
          

          export const getFuelAvailabilityByFuelTypeAndAvailability = async (req, res, next) => {
            const { fuel_type } = req.params;
          
            try {
              const fuelAvailability = await getFuelAvailabilityByFuelTypeAndAvailabilityService(fuel_type,true);
          
              if (fuelAvailability.length === 0) {
                return handleResponse(res, 404, "No fuel availability found for the specified fuel type and availability status", null);
              }
          
              handleResponse(res, 200, "Fuel availability retrieved successfully", fuelAvailability);
            } catch (err) {
              next(err);
            }
          };

          export const getLastFuelAvailabilityByStationAndFuelType = async (req, res, next) => {
            const { id } = req.params;
            const fuel_type = req.body.fuel_type;
            
          
            try {
              const fuelAvailability = await getLastFuelAvailabilityByStationAndFuelTypeService(id,fuel_type,);
          
              if (fuelAvailability.length === 0) {
                return handleResponse(res, 404, "No fuel availability found for the specified fuel type and availability status", null);
              }
          
              handleResponse(res, 200, "Fuel availability retrieved successfully", fuelAvailability.available);
            } catch (err) {
              next(err);
            }
          };
          
          export const getAllAvailabilityHoursByUserId = async (req,res,next) =>{
            try {
              const user_id = req.user.id;

              const {start_date,end_date} = req.body;
              
              const station = await getStationByUserIdService(user_id);
              const fuelAvailability = await getAllAvailabilityHours(start_date,end_date,station?.id);
          
              if (fuelAvailability.length === 0) {
                return handleResponse(res, 404, "No fuel availability found for the this station", null);
              }
          
              handleResponse(res, 200, "Fuel availability retrieved successfully", fuelAvailability);
            } catch (err) {
              next(err);
            }
          }
          

