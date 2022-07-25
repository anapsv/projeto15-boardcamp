import { loadCustomers, loadCustomer, addNewCustomer, updateCustomer, } from "../controllers/customersController.js";
import { ValidateCustomer } from "../middlewares/customersMiddleware.js";
import { Router } from "express";
  
const router = Router();
  
router.get('/customers', loadCustomers);
router.get('/customers/:id', loadCustomer);
router.post('/customers', ValidateCustomer, addNewCustomer);
router.put('/customers/:id', ValidateCustomer, updateCustomer);
  
export default router;