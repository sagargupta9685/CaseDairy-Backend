const { poolPromise } = require('../utils/db');

exports.addRecords = async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id; // <-- Get from token

    const {
      unit_name,
      description,
      url,
      noc_date,
      valid_till,
      notification_days,
    } = req.body;

        const document_path = req.files && req.files.length > 0
      ? req.files.map(file => file.path).join(',')
      : null;

    await pool.request()
      .input('unit_name', unit_name)
      .input('description', description)
      .input('url', url)
      .input('noc_date', noc_date)
      .input('valid_till', valid_till)
      .input('notification_days', notification_days)
      .input('document_path', document_path)
      .input('userId', userId)
      .query(`
        INSERT INTO miscellaneous 
        (unit_name, description, url, noc_date, valid_till, notification_days, document_path, userId) 
        VALUES (@unit_name, @description, @url, @noc_date, @valid_till, @notification_days, @document_path, @userId)
      `);

    res.status(200).json({ message: "Record inserted successfully" });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getAllMiscellaneousRecord = async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user.id; // 👈 From token

    const result = await pool.request()
      .input('userId', userId)
     .query(`SELECT * FROM miscellaneous WHERE userId = @userId`);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Get AddCase Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};



