import asyncHandler from 'express-async-handler';
import prisma from '../../Config/prismaConfig.js';
import { json } from 'express';

export const createUser = asyncHandler(async (req, res) => {
    console.log("Creating user ");

    const { email } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email: email } });

    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    }

    const user = await prisma.user.create({ data: req.body });
    res.json({
        message: "User created",
        user: user,
    });
})

export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;

    const allreadyBookingExists = await prisma.user.findUnique({
        where: { email },
        select: {
            bookedVisits: true
        }
    })

    if (allreadyBookingExists.bookedVisits.some((visit) => visit.id === id)) {
        res.status(400)
        res.json({ message: "allready Booking Exists" })
    }
    else {
        await prisma.user.update({
            where: { email },
            data: {
                bookedVisits: { push: { date, id } }
            }
        })
        res.json("Booking is created successfully")
    }
})

export const getAllBooking = asyncHandler(async (req, res) => {
    const { email } = req.body
    const bookings = await prisma.user.findUnique({
        where: { email },
        select: {
            bookedVisits: true
        }
    })
    return res.json(bookings)
})

export const cancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
        select: { bookedVisits: true }
    });

    if (!user || !user.bookedVisits || user.bookedVisits.length === 0) {
        return res.status(404).json({ message: "Booking not found" });
    }

    const bookingIndex = user.bookedVisits.findIndex(visit => visit.id === id);

    if (bookingIndex === -1) {
        return res.status(404).json({ message: "Booking not found" });
    }

    user.bookedVisits.splice(bookingIndex, 1);

    await prisma.user.update({
        where: { email },
        data: { bookedVisits: user.bookedVisits }
    });

    return res.status(200).json({ message: "Booking cancelled successfully" });

});


export const tofav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { rid } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let updateUser;

        if (user.favResidenciesID.includes(rid)) {
            updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter(id => id !== rid)
                    }
                }
            });
            return res.status(200).json({ message: 'Removed from favorites', user: updateUser });
        } else {
            updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        push: rid
                    }
                }
            });
            return res.status(200).json({ message: 'Added to favorites', user: updateUser });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


export const getAllFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const allFav = await prisma.user.findUnique({
        where: { email },
        select: {
            favResidenciesID: true
        }
    });
    return res.json(allFav)
})