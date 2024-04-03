import express from 'express';
import { bookVisit, cancelBooking, createUser, getAllBooking, getAllFav, tofav } from '../function/User/userFunction.js';
const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/bookVisit/:id", bookVisit)
userRouter.post("/allBooking",getAllBooking)
userRouter.post("/cancelBooking/:id",cancelBooking)
userRouter.post("/tofav/:rid",tofav)
userRouter.post("/allFav", getAllFav)

export default userRouter;
