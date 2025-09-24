'use strict';

/**
 * global-age-gate service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::global-age-gate.global-age-gate');
