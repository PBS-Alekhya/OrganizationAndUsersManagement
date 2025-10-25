const db = require('../config/db');

exports.getAllOrganizations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM organizations');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};



exports.createOrganization = async (req, res) => {
  const { name, slug, email, contact } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Organization mail are required' });
  }

  try {
    const sql = `
      INSERT INTO organizations (name, slug, organization_mail, contact, status) 
      VALUES (?, ?, ?, ?, 'Inactive')
    `;
    
    // We default new orgs to 'Inactive'
    const [result] = await db.query(sql, [name, slug, email, contact]);
    
    // Send back the newly created organization
    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      organization_mail: email,
      contact,
      status: 'Inactive'
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Error saving to database' });
  }
};

exports.getOrganizationById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM organizations WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
};

exports.updateOrganization = async (req, res) => {
  const { id } = req.params;
  // Get all fields from the body
  const {
    name, slug, organization_mail, contact,
    primary_admin_name, primary_admin_email, support_email, alt_phone_number,
    max_coordinators, timezone_common, timezone_region, language, website_url
  } = req.body;

  try {
    const sql = `
      UPDATE organizations
      SET
        name = ?, slug = ?, organization_mail = ?, contact = ?,
        primary_admin_name = ?, primary_admin_email = ?, support_email = ?, alt_phone_number = ?,
        max_coordinators = ?, timezone_common = ?, timezone_region = ?, 
        language = ?, website_url = ?
      WHERE id = ?
    `;
    
    await db.query(sql, [
      name, slug, organization_mail, contact,
      primary_admin_name, primary_admin_email, support_email, alt_phone_number,
      max_coordinators, timezone_common, timezone_region, language, website_url,
      id 
    ]);
    
    res.status(200).json({ message: 'Organization updated successfully' });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ message: 'Error saving to database' });
  }
};

exports.updateOrganizationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const allowedStatuses = ['Active', 'Blocked', 'Inactive'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const sql = 'UPDATE organizations SET status = ? WHERE id = ?';
    const [result] = await db.query(sql, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(200).json({ message: 'Organization status updated successfully', newStatus: status });
  } catch (error) {
    console.error('Error updating organization status:', error);
    res.status(500).json({ message: 'Error updating status in database' });
  }
};


exports.deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {

    const sqlHard = 'DELETE FROM organizations WHERE id = ?';
    const [resultHard] = await db.query(sqlHard, [id]);
    
    // Use the result from the chosen option
    const result = resultHard; 
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(200).json({ message: 'Organization marked as inactive successfully' }); 
    
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ message: 'Error deleting organization from database' });
  }
};
