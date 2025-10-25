const db = require('../config/db');

// Get users
exports.getUsersByOrganization = async (req, res) => {
  const { orgId } = req.params;
  try {
    const [rows] = await db.query(
      
      'SELECT id, user_name, role, status FROM users WHERE organization_id = ?',
      [orgId]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Create user 

exports.createUser = async (req, res) => {
  const { orgId } = req.params;
  const { userName, role } = req.body;

  if (!userName || !role) {
    return res.status(400).json({ message: 'User name and role are required' });
  }

  const defaultStatus = 'Active';
  const defaultPasswordHash = 'temporary_placeholder_hash'; 
  

  try {
    
    
    const sql = `
      INSERT INTO users (organization_id, user_name, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    
    
    const [result] = await db.query(sql, [
        orgId,
        userName,
        defaultPasswordHash,
        role,
        defaultStatus
    ]);

    
    res.status(201).json({
      id: result.insertId,
      organization_id: parseInt(orgId, 10),
      user_name: userName,
      role: role,
      status: defaultStatus
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error saving user to database' });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  
  const { userName, role } = req.body;

  if (!userName || !role) {
    return res.status(400).json({ message: 'User name and role are required' });
  }

  try {
    
    
    const sql = `
      UPDATE users
      SET user_name = ?, role = ?
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [userName, role, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    // Removed duplicate email error check
    res.status(500).json({ message: 'Error updating user in database' });
  }
};

// Delete user 
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.query(sql, [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user from database' });
  }
};