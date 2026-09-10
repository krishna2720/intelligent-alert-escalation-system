import fs from "fs"; //for reading file i.e. rules.json

import path from "path";

import { fileURLToPath } from "url";

import Alert from "../models/Alert.js";

import logger from "../config/logger.js";

const __filename = fileURLToPath(import.meta.url);  //complete file path 

const __dirname = path.dirname(__filename);     //only till directory path 

const rulesPath = path.join(__dirname, "../config/rules.json"); //rules.json ka path

const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));   //file read kro rules.json ki 

const evaluateEscalation = async (alert) => {
  const rule = rules[alert.sourceType]; //checking in rules.json file via sourceType 

  if (!rule || !rule.escalate_if_count) return;   //mainly compliance ke liye  return krjao yr 

  // If already escalated, no need to re-evaluate
  if (alert.status === "ESCALATED") return;

  const windowStart = new Date(Date.now() - rule.window_mins * 60 * 1000);
 
  //search in the database via give rules (same driver id + same source type + recent time)
  const countInWindow = await Alert.countDocuments({
         driverId: alert.driverId,
         sourceType: alert.sourceType,
         createdAt: { $gte: windowStart },
   });

  const alreadyEscalated = await Alert.exists({     
           driverId: alert.driverId,
           sourceType: alert.sourceType,
           status: "ESCALATED",
           createdAt: { $gte: windowStart }
  });

  //Escalation should trigger only once per threshold breach
  if (countInWindow < rule.escalate_if_count || alreadyEscalated)
  return;

  const previousState = alert.status;

  alert.status = "ESCALATED";
  alert.severity = "CRITICAL";
  alert.escalationCount += 1;

  alert.history.push({
    fromState: previousState,
    toState: "ESCALATED",
    reason: "Escalation threshold reached",
  });

  await alert.save();

  logger.info(`Alert escalated: ${alert.alertId}`);
};

export { evaluateEscalation };