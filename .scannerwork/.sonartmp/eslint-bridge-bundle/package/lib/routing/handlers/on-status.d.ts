import express from 'express';
/**
 * Handles status requests
 *
 * This endpoint handler allows the sensor to make sure that the bridge is alive
 * and can continue handle analysis requests or any other kind of request.
 */
export declare function onStatus(_request: express.Request, response: express.Response): void;
