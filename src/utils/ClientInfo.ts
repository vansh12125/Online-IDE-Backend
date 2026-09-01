import { UAParser } from "ua-parser-js";
import { Request } from "express";
import { ClientInfo } from "../types";

const getClientInfo = (req: Request): ClientInfo => {
  const parser: UAParser = new UAParser(req.get("user-agent"));
  const browser: UAParser.IBrowser = parser.getBrowser();
  const os: UAParser.IOS = parser.getOS();
  const device: UAParser.IDevice = parser.getDevice();

  return {
    ipAddress: req.ip,
    browser: browser.name ?? "Unknown",
    browserVersion: browser.version ?? "Unknown",
    os: os.name ?? "Unknown",
    osVersion: os.version ?? "Unknown",
    device: device.type ?? "Desktop",
  } as ClientInfo;
};

export default getClientInfo;
