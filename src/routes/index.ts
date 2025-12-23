import { Router } from 'express'
import { createOrderHandler, listOrdersHandler } from './orders.ts'
import { getProductStatsHandler } from './stats.ts'
import { healthHandler } from './health.ts'

const router = Router()

router.get('/health', healthHandler)
router.post('/orders', createOrderHandler)
router.get('/orders', listOrdersHandler)
router.get('/stats/products', getProductStatsHandler)

export default router
