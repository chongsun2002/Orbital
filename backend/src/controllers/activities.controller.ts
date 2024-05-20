import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import ActivitiesDAO from "../services/activities.DAO.js";
import { User, Activity } from "@prisma/client";
import { RequestHandler  } from "express";
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

export default class ActivitiesController {
    static apiCreateActivity : RequestHandler = async (req, res, next) => {
        const title = req.body.title
        const description = req.body.description
        const startTime = req.body.startTime
        const endTime = req.body.endTime
        const numOfParticipants = req.body.numOfParticipants

        const publicKeyFilePath = path.join(process.cwd(), 'src', 'configs', 'id_rsa_pub.pem');
        const PUB_KEY = fs.readFileSync(publicKeyFilePath, 'utf-8');
        const token: string | undefined = req.header('Authorization')
        if (token === undefined) {
            console.error('User is not signed in')
            res.status(400) 
            return
        }
        const payload = jwt.verify(token, PUB_KEY)
        if (payload === undefined) {
            console.error('JWT is invalid')
            res.status(401)
            return
        }
        try {
            const activity: Activity = await ActivitiesDAO.createActivity({
                title: title,
                description: description,
                startTime: startTime,
                endTime: endTime,
                numOfParticipants: numOfParticipants
            }, payload.sub)
            res.status(200).json({activityId: activity.id})
            return
        } catch (error) {
            console.error('Unexpected error creating activity')
            res.status(500).json({error: (error as Error).message})
            return
        } 
    }


}