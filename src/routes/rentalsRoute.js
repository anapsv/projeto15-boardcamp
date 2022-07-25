import { Router } from "express";
import { loadRentals, addNewRental, deleteRental, returnRental } from "../controllers/rentalsController.js";
import { ValidateRental, ValidateDeleteRental, ValidateReturnRental } from "../middlewares/rentalsMiddleware.js";

const router = Router();

router.get('/rentals', loadRentals);
router.post('/rentals', ValidateRental, addNewRental);
router.delete('/rentals/:id', ValidateDeleteRental, deleteRental);
router.post('/rentals/:id/return', ValidateReturnRental, returnRental);

export default router;