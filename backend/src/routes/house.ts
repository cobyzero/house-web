import { Router, type Request, type Response } from "express"
import { externalApiClient } from "../utils/api-client"

const router = Router()

// POST /house/findUserHouse
router.post("/findUserHouse", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body

    if (userId === undefined || userId === null) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      })
    }

    const result = await externalApiClient.post("/house/findUserHouse", {
      userId,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] findUserHouse error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to find user house",
    })
  }
})

// POST /house/findDevicesByRoomId
router.post("/findDevicesByRoomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body

    if (roomId === undefined || roomId === null) {
      return res.status(400).json({
        success: false,
        message: "roomId is required",
      })
    }

    const result = await externalApiClient.post("/house/findDevicesByRoomId", {
      roomId,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] findDevicesByRoomId error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to find devices",
    })
  }
})

// POST /house/findDevicesByHouseId
router.post("/findDevicesByHouseId", async (req: Request, res: Response) => {
  try {
    const { houseId } = req.body

    if (houseId === undefined || houseId === null) {
      return res.status(400).json({
        success: false,
        message: "houseId is required",
      })
    }

    const result = await externalApiClient.post("/house/findDevicesByHouseId", {
      houseId,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] findDevicesByHouseId error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to find devices",
    })
  }
})

// POST /house/lightDevice
router.post("/lightDevice", async (req: Request, res: Response) => {
  try {
    const { deviceId, light } = req.body

    if (deviceId === undefined || light === undefined) {
      return res.status(400).json({
        success: false,
        message: "deviceId and light status are required",
      })
    }

    const result = await externalApiClient.post("/house/lightDevice", {
      deviceId,
      light,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] lightDevice error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to control light device",
    })
  }
})

// POST /house/ventilationDevice
router.post("/ventilationDevice", async (req: Request, res: Response) => {
  try {
    const { deviceId, ventilation } = req.body

    if (deviceId === undefined || ventilation === undefined) {
      return res.status(400).json({
        success: false,
        message: "deviceId and ventilation status are required",
      })
    }

    const result = await externalApiClient.post("/house/ventilationDevice", {
      deviceId,
      ventilation,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] ventilationDevice error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to control ventilation device",
    })
  }
})

// POST /house/temperatureByRoomId
router.post("/temperatureByRoomId", async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body

    if (roomId === undefined || roomId === null) {
      return res.status(400).json({
        success: false,
        message: "roomId is required",
      })
    }

    const result = await externalApiClient.post("/house/temperatureByRoomId", {
      roomId,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] temperatureByRoomId error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch temperature data",
    })
  }
})

// POST /house/createRoom
router.post("/createRoom", async (req: Request, res: Response) => {
  try {
    const { houseId, name } = req.body

    if (houseId === undefined || !name) {
      return res.status(400).json({
        success: false,
        message: "houseId and name are required",
      })
    }

    const result = await externalApiClient.post("/house/createRoom", {
      houseId,
      name,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] createRoom error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create room",
    })
  }
})

// POST /house/createDevice
router.post("/createDevice", async (req: Request, res: Response) => {
  try {
    const { roomId, name, pinId } = req.body

    if (roomId === undefined || !name || pinId === undefined) {
      return res.status(400).json({
        success: false,
        message: "roomId, name, and pinId are required",
      })
    }

    const result = await externalApiClient.post("/house/createDevice", {
      roomId,
      name,
      pinId,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error("[House] createDevice error:", error)
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create device",
    })
  }
})

export default router
