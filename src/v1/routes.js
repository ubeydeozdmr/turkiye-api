const express = require('express');
const controller = require('./controller');

const router = express.Router();

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Get all provinces.
 *     description: Get all provinces.
 *     parameters:
 *       - in: query
 *         name: name
 *         description: The province name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPopulation
 *         description: The minimum population of the province.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPopulation
 *         description: The maximum population of the province.
 *         schema:
 *           type: number
 *       - in: query
 *         name: minArea
 *         description: The minimum area of the province.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxArea
 *         description: The maximum area of the province.
 *         schema:
 *           type: number
 *       - in: query
 *         name: minAltitude
 *         description: The minimum altitude of the province.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxAltitude
 *         description: The maximum altitude of the province.
 *         schema:
 *           type: number
 *       - in: query
 *         name: isCoastal
 *         description: The province is coastal or not.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isMetropolitan
 *         description: The province is metropolitan or not.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: offset
 *         description: The offset of the provinces list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         description: The limit of the provinces list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: The sorting of the provinces list. (put '-' before the field name for descending order)
 *         schema:
 *           type: string
 *     tags:
 *       - Provinces
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of provinces.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: The province ID.
 *                         example: 34
 *                       name:
 *                         type: string
 *                         description: The province name.
 *                         example: İstanbul
 *                       population:
 *                         type: number
 *                         description: The province population.
 *                         example: 15655924
 *                       area:
 *                         type: number
 *                         description: The province area (in square meters).
 *                         example: 5461
 *                       altitude:
 *                         type: number
 *                         description: The province altitude (in meters).
 *                         example: 25
 *                       areaCode:
 *                         type: array
 *                         description: The province area codes.
 *                         items:
 *                           type: number
 *                           example: 212, 216
 *                       isCoastal:
 *                         type: boolean
 *                         description: The province is coastal or not.
 *                         example: true
 *                       isMetropolitan:
 *                         type: boolean
 *                         description: The province is metropolitan or not.
 *                         example: true
 *                       nuts:
 *                         type: object
 *                         description: The NUTS codes of the province.
 *                         properties:
 *                           nuts1:
 *                             type: object
 *                             description: The NUTS1 code of the province.
 *                             properties:
 *                               code:
 *                                 type: string
 *                                 example: TR1
 *                               name:
 *                                 type: object
 *                                 properties:
 *                                   en:
 *                                     type: string
 *                                     example: İstanbul
 *                                   tr:
 *                                     type: string
 *                                     example: İstanbul
 *                           nuts2:
 *                             type: object
 *                             description: The NUTS2 code of the province.
 *                             properties:
 *                               code:
 *                                 type: string
 *                                 example: TR10
 *                               name:
 *                                 type: string
 *                                 example: İstanbul
 *                           nuts3:
 *                             type: string
 *                             example: TR100
 *                       coordinates:
 *                         type: object
 *                         description: The province coordinates.
 *                         properties:
 *                           latitude:
 *                             type: number
 *                             example: 41.01384
 *                           longitude:
 *                             type: number
 *                             example: 28.94966
 *                       maps:
 *                         type: object
 *                         description: The province map links.
 *                         properties:
 *                           googleMaps:
 *                             type: string
 *                             example: https://goo.gl/maps/wKdwRFM4NW8Wm6ZZ8
 *                           openStreetMap:
 *                             type: string
 *                             example: https://www.openstreetmap.org/relation/223474
 *                       region:
 *                         type: object
 *                         description: The region of the province.
 *                         properties:
 *                           en:
 *                             type: string
 *                             example: Marmara
 *                           tr:
 *                             type: string
 *                             example: Marmara
 *                       districts:
 *                         type: array
 *                         description: The districts of the province.
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                               example: 1852
 *                             name:
 *                               type: string
 *                               example: Ümraniye
 *                             population:
 *                               type: number
 *                               example: 723760
 *                             area:
 *                               type: number
 *                               example: 46
 *       404:
 *         description: Provinces not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Provinces not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/provinces', controller.getProvinces);

/**
 * @swagger
 * /provinces/{id}:
 *   get:
 *     summary: Get exact province.
 *     description: Get exact province.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The province ID / plate number.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *       - in: query
 *         name: extend
 *         description: Extend the response with additional data. (neighborhoods and villages)
 *         schema:
 *           type: boolean
 *     tags:
 *       - Provinces
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The province.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 34
 *                     name:
 *                       type: string
 *                       example: İstanbul
 *                     population:
 *                       type: number
 *                       example: 15655924
 *                     area:
 *                       type: number
 *                       example: 5461
 *                     altitude:
 *                       type: number
 *                       example: 25
 *                     areaCode:
 *                       type: array
 *                       items:
 *                         type: number
 *                         example: 212, 216
 *                     isCoastal:
 *                       type: boolean
 *                       example: true
 *                     isMetropolitan:
 *                       type: boolean
 *                       example: true
 *                     nuts:
 *                       type: object
 *                       properties:
 *                         nuts1:
 *                           type: object
 *                           properties:
 *                             code:
 *                               type: string
 *                               example: TR1
 *                             name:
 *                               type: object
 *                               properties:
 *                                 en:
 *                                   type: string
 *                                   example: İstanbul
 *                                 tr:
 *                                   type: string
 *                                   example: İstanbul
 *                         nuts2:
 *                           type: object
 *                           properties:
 *                             code:
 *                               type: string
 *                               example: TR10
 *                             name:
 *                               type: string
 *                               example: İstanbul
 *                         nuts3:
 *                           type: string
 *                           example: TR100
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                           example: 41.01384
 *                         longitude:
 *                           type: number
 *                           example: 28.94966
 *                     maps:
 *                       type: object
 *                       properties:
 *                         googleMaps:
 *                           type: string
 *                           example: https://goo.gl/maps/wKdwRFM4NW8Wm6ZZ8
 *                         openStreetMap:
 *                           type: string
 *                           example: https://www.openstreetmap.org/relation/223474
 *                     region:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: Marmara
 *                         tr:
 *                           type: string
 *                           example: Marmara
 *                     districts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 1852
 *                           name:
 *                             type: string
 *                             example: Ümraniye
 *                           population:
 *                             type: number
 *                             example: 723760
 *                           area:
 *                             type: number
 *                             example: 46
 *       404:
 *         description: Province not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Province not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/provinces/:id', controller.getExactProvince);

/**
 * @swagger
 * /districts:
 *  get:
 *   summary: Get all districts.
 *   description: Get all districts.
 *   parameters:
 *     - in: query
 *       name: name
 *       description: The district name.
 *       schema:
 *         type: string
 *     - in: query
 *       name: minPopulation
 *       description: The minimum population of the district.
 *       schema:
 *         type: number
 *     - in: query
 *       name: maxPopulation
 *       description: The maximum population of the district.
 *       schema:
 *         type: number
 *     - in: query
 *       name: minArea
 *       description: The minimum area of the district.
 *       schema:
 *         type: number
 *     - in: query
 *       name: maxArea
 *       description: The maximum area of the district.
 *       schema:
 *         type: number
 *     - in: query
 *       name: provinceId
 *       description: The province ID.
 *       schema:
 *         type: number
 *     - in: query
 *       name: province
 *       description: The province name.
 *       schema:
 *         type: string
 *     - in: query
 *       name: offset
 *       description: The offset of the districts list.
 *       schema:
 *         type: number
 *     - in: query
 *       name: limit
 *       description: The limit of the districts list.
 *       schema:
 *         type: number
 *     - in: query
 *       name: fields
 *       description: The fields to be returned. (comma separated)
 *       schema:
 *         type: string
 *     - in: query
 *       name: sort
 *       description: The sorting of the districts list. (put '-' before the field name for descending order)
 *       schema:
 *         type: string
 *   tags:
 *     - Districts
 *   produces:
 *     - application/json
 *   responses:
 *     200:
 *       description: A list of districts.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: OK
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     provinceId:
 *                       type: number
 *                       example: 28
 *                     id:
 *                       type: number
 *                       example: 1272
 *                     province:
 *                       type: string
 *                       example: Giresun
 *                     name:
 *                       type: string
 *                       example: Dereli
 *                     population:
 *                       type: number
 *                       example: 19308
 *                     area:
 *                       type: number
 *                       example: 849
 *     404:
 *       description: District not found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: ERROR
 *               error:
 *                 type: string
 *                 example: District not found.
 *     405:
 *       description: Method not allowed.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: ERROR
 *               error:
 *                 type: string
 *                 example: Method not allowed.
 */
router.get('/districts', controller.getDistricts);

/**
 * @swagger
 * /districts/{id}:
 *   get:
 *     summary: Get exact district.
 *     description: Get exact district.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The district ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *     tags:
 *       - Districts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The district.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     provinceId:
 *                       type: number
 *                       example: 28
 *                     id:
 *                       type: number
 *                       example: 1272
 *                     provinceName:
 *                       type: string
 *                       example: Giresun
 *                     name:
 *                       type: string
 *                       example: Dereli
 *                     population:
 *                       type: number
 *                       example: 19308
 *                     area:
 *                       type: number
 *                       example: 849
 *                     neighborhoods:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 30780
 *                           name:
 *                             type: string
 *                             example: Kuşluhan
 *                           population:
 *                             type: number
 *                             example: 886
 *                     villages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 14547
 *                           name:
 *                             type: string
 *                             example: Küçükahmet
 *                           population:
 *                             type: number
 *                             example: 278
 *       404:
 *         description: District not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: District not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/districts/:id', controller.getExactDistrict);

/**
 * @swagger
 * /neighborhoods:
 *   get:
 *     summary: Get all neighborhoods.
 *     description: Get all neighborhoods.
 *     parameters:
 *       - in: query
 *         name: name
 *         description: The neighborhood name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPopulation
 *         description: The minimum population of the neighborhood.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPopulation
 *         description: The maximum population of the neighborhood.
 *         schema:
 *           type: number
 *       - in: query
 *         name: provinceId
 *         description: The province ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: province
 *         description: The province name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: districtId
 *         description: The district ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: district
 *         description: The district name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: offset
 *         description: The offset of the neighborhoods list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         description: The limit of the neighborhoods list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: The sorting of the neighborhoods list. (put '-' before the field name for descending order)
 *         schema:
 *           type: string
 *     tags:
 *       - Neighborhoods
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of neighborhoods.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       provinceId:
 *                         type: number
 *                         example: 28
 *                       districtId:
 *                         type: number
 *                         example: 1272
 *                       id:
 *                         type: number
 *                         example: 30780
 *                       province:
 *                         type: string
 *                         example: Giresun
 *                       district:
 *                         type: string
 *                         example: Dereli
 *                       name:
 *                         type: string
 *                         example: Kuşluhan
 *                       population:
 *                         type: number
 *                         example: 886
 *       404:
 *         description: Neighborhoods not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Neighborhoods not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/neighborhoods', controller.getNeighborhoods);

/**
 * @swagger
 * /neighborhoods/{id}:
 *   get:
 *     summary: Get exact neighborhood.
 *     description: Get exact neighborhood.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The neighborhood ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *     tags:
 *       - Neighborhoods
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The neighborhood.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     provinceId:
 *                       type: number
 *                       example: 28
 *                     districtId:
 *                       type: number
 *                       example: 1272
 *                     id:
 *                       type: number
 *                       example: 30780
 *                     province:
 *                       type: string
 *                       example: Giresun
 *                     district:
 *                       type: string
 *                       example: Dereli
 *                     name:
 *                       type: string
 *                       example: Kuşluhan
 *                     population:
 *                       type: number
 *                       example: 886
 *       404:
 *         description: Neighborhood not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Neighborhood not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/neighborhoods/:id', controller.getExactNeighborhood);

/**
 * @swagger
 * /villages:
 *   get:
 *     summary: Get all villages.
 *     description: Get all villages.
 *     parameters:
 *       - in: query
 *         name: name
 *         description: The village name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPopulation
 *         description: The minimum population of the village.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPopulation
 *         description: The maximum population of the village.
 *         schema:
 *           type: number
 *       - in: query
 *         name: provinceId
 *         description: The province ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: province
 *         description: The province name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: districtId
 *         description: The district ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: district
 *         description: The district name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: offset
 *         description: The offset of the villages list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         description: The limit of the villages list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: The sorting of the villages list. (put '-' before the field name for descending order)
 *         schema:
 *           type: string
 *     tags:
 *       - Villages
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of villages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       provinceId:
 *                         type: number
 *                         example: 28
 *                       districtId:
 *                         type: number
 *                         example: 1272
 *                       neighborhoodId:
 *                         type: number
 *                         example: 30780
 *                       id:
 *                         type: number
 *                         example: 14547
 *                       province:
 *                         type: string
 *                         example: Giresun
 *                       district:
 *                         type: string
 *                         example: Dereli
 *                       name:
 *                         type: string
 *                         example: Küçükahmet
 *                       population:
 *                         type: number
 *                         example: 278
 *       404:
 *         description: Villages not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Villages not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                  type: string
 *                  example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/villages', controller.getVillages);

/**
 * @swagger
 * /villages/{id}:
 *   get:
 *     summary: Get exact village.
 *     description: Get exact village.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The village ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *     tags:
 *       - Villages
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The village.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     provinceId:
 *                       type: number
 *                       example: 28
 *                     districtId:
 *                       type: number
 *                       example: 1272
 *                     id:
 *                       type: number
 *                       example: 14547
 *                     province:
 *                       type: string
 *                       example: Giresun
 *                     district:
 *                       type: string
 *                       example: Dereli
 *                     name:
 *                       type: string
 *                       example: Küçükahmet
 *                     population:
 *                       type: number
 *                       example: 278
 *       404:
 *         description: Village not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Village not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/villages/:id', controller.getExactVillage);

/**
 * @swagger
 * /towns:
 *   get:
 *     summary: Get all towns.
 *     description: Get all towns.
 *     parameters:
 *       - in: query
 *         name: name
 *         description: The town name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPopulation
 *         description: The minimum population of the town.
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPopulation
 *         description: The maximum population of the town.
 *         schema:
 *           type: number
 *       - in: query
 *         name: provinceId
 *         description: The province ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: province
 *         description: The province name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: districtId
 *         description: The district ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: district
 *         description: The district name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: offset
 *         description: The offset of the towns list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         description: The limit of the towns list.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: The sorting of the towns list. (put '-' before the field name for descending order)
 *         schema:
 *           type: string
 *     tags:
 *       - Towns
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of towns.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       provinceId:
 *                         type: number
 *                         example: 28
 *                       districtId:
 *                         type: number
 *                         example: 1352
 *                       id:
 *                         type: number
 *                         example: 2029
 *                       province:
 *                         type: string
 *                         example: Giresun
 *                       district:
 *                         type: string
 *                         example: Merkez
 *                       name:
 *                         type: string
 *                         example: Duroğlu
 *                       population:
 *                         type: number
 *                         example: 2897
 *       404:
 *         description: Towns not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Towns not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/towns', controller.getTowns);

/**
 * @swagger
 * /towns/{id}:
 *   get:
 *     summary: Get exact town.
 *     description: Get exact town.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The town ID.
 *         schema:
 *           type: number
 *       - in: query
 *         name: fields
 *         description: The fields to be returned. (comma separated)
 *         schema:
 *           type: string
 *     tags:
 *       - Towns
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The town.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: object
 *                   properties:
 *                     provinceId:
 *                       type: number
 *                       example: 28
 *                     districtId:
 *                       type: number
 *                       example: 1352
 *                     id:
 *                       type: number
 *                       example: 2029
 *                     province:
 *                       type: string
 *                       example: Giresun
 *                     district:
 *                       type: string
 *                       example: Merkez
 *                     name:
 *                       type: string
 *                       example: Duroğlu
 *                     population:
 *                       type: number
 *                       example: 2897
 *       404:
 *         description: Town not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Town not found.
 *       405:
 *         description: Method not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ERROR
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 */
router.get('/towns/:id', controller.getExactTown);

router
  .get('*', (req, res) => {
    res.status(404).json({
      status: 'ERROR',
      error: 'Wrong endpoint.',
    });
  })
  .all('*', (req, res) => {
    res.status(405).json({
      status: 'ERROR',
      error: 'Method not allowed.',
    });
  });

module.exports = router;
