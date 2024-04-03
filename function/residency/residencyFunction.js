import asyncHandler from 'express-async-handler';
import prisma from '../../Config/prismaConfig.js';

export const createResidency = asyncHandler(async (req, res) => {
    console.log("create residency");

    const {title,description,price,address,city,country,image,facilities,userEmail,} = req.body.data;

    const existingResidency = await prisma.residency.findUnique({
        where: {
            address_userEmail: {
                ResidenceName,
                address,
                userEmail
            }
        }
    });

    if (existingResidency) {
        return res.status(400).json({
            error: "Residency already exists"
        });
    }

    const newResidency = await prisma.residency.create({
        data: {
            title,
            description,
            price,
            address,
            city,
            country,
            image,
            facilities,
            owner: {
                connect: {
                    email: userEmail
                }
            }
        }
    });

    return res.json({
        message: "Residency created",
        residency: newResidency,
    });
});

export const getResidencies = asyncHandler(async (req, res) => {
    const residency = await prisma.residency.findMany({
        orderBy:{
            createdAt: "desc",
        }
    });

    return res.json(residency)
});

export const getResidenciesByID = asyncHandler(async (req,res)=>{
    const { id } = req.params;
    const residency = await prisma.residency.findUnique({
        where: {
            id
        }
    });
    return res.json(residency)
})