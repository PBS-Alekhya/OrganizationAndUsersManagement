const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

// GET /api/organizations
router.get('/', organizationController.getAllOrganizations);

// POST /api/organizations
router.post('/', organizationController.createOrganization);


// GET /api/organizations/:id
router.get('/:id', organizationController.getOrganizationById);

// PUT /api/organizations/:id
router.put('/:id', organizationController.updateOrganization);

// PATCH /api/organizations/:id/status
router.patch('/:id/status', organizationController.updateOrganizationStatus);


// DELETE /api/organizations/:id
router.delete('/:id', organizationController.deleteOrganization);

module.exports = router;