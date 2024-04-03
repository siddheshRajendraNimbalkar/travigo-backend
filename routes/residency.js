import express from "express";
import { createResidency, getResidencies, getResidenciesByID } from "../function/residency/residencyFunction.js";
const residencyRouter = express.Router();

residencyRouter.post('/create', createResidency)
residencyRouter.post('/getresidency', getResidencies)
residencyRouter.post('/:id', getResidenciesByID)

export default residencyRouter;