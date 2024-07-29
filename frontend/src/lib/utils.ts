import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dotenv from "dotenv";
dotenv.config();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const DEV: string | undefined = process.env.DEVELOPMENT_BACKEND_URL;
const PROD: string | undefined = process.env.PRODUCTION_BACKEND_URL;

//process.env.NUSMODS_API;

export const API_URL: string | undefined = DEV;