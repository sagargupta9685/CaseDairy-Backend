const { poolPromise } = require('../utils/db');

exports.addCase = async (req, res) => {
  const { userId, title, description, caseDate } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('userId', userId)
      .input('title', title)
      .input('description', description)
      .input('caseDate', caseDate)
      .query(`INSERT INTO Cases (userId, title, description, caseDate)
              VALUES (@userId, @title, @description, @caseDate)`);

    res.status(201).json({ message: 'Case added successfully' });
  } catch (err) {
    console.error('Add Case Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getCasesByUser = async (req, res) => {
  const { userId } = req.params;
  console.log("user:",userId);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', userId)
      .query(`SELECT * FROM Cases WHERE userId = @userId ORDER BY caseDate ASC`);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Get Cases Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

 

  // controllers/caseController.js
exports.markCaseComplete = async (req, res) => {
  const caseId = req.params.id;
   // <-- Add this!
  console.log("📌 Case ID received in backend:", caseId);  // <-- Add this!

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('caseId', caseId)
      .query(`UPDATE Cases SET status = 'Completed' WHERE id = \
        
        
        @caseId`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json({ message: 'Case marked as completed.' });
  } catch (err) {
    console.error('Complete Case Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};


 


// exports.addHearingDate = async (req, res) => {
//    const { caseId, hearingDate, description, notificationDays } = req.body;


//   try {
//     const pool = await poolPromise;
//     await pool.request()
//        .input('caseId', caseId)
//       .input('hearingDate', hearingDate)
//       .input('description', description)
//       .input('notificationDays', notificationDays)
//       .query(`
//         INSERT INTO HearingDates (caseId, hearingDate, description, notificationDays)
//         VALUES (@caseId, @hearingDate, @description, @notificationDays)
//       `);
//     res.status(201).json({ message: 'Hearing date added!' });
//     console.log("🔁 Adding hearing for case:", caseId, "on date:", hearingDate);

//   } catch (err) {
//     console.error('Add Hearing Date Error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


exports.addHearingDate = async (req, res) => {
  const { caseId, hearingDate, description, notificationDays, nextHearingDate } = req.body;

  // Validation: nextHearingDate > hearingDate
  // if (new Date(nextHearingDate) <= new Date(hearingDate)) {
  //   return res.status(400).json({ error: 'Next hearing date must be greater than hearing date.' });
  // }
if (new Date(nextHearingDate) <= new Date(hearingDate)) {
    return res.status(400).json({ error: 'Next hearing date must be greater than hearing date.' });
  }


  try {
    const pool = await poolPromise;
    await pool.request()
      .input('caseId', caseId)
      .input('hearingDate', hearingDate)
      .input('description', description)
      .input('notificationDays', notificationDays)
      .input('nextHearingDate', nextHearingDate)
      .query(`
        INSERT INTO HearingDates (caseId, hearingDate, description, notificationDays, nextHearingDate)
        VALUES (@caseId, @hearingDate, @description, @notificationDays, @nextHearingDate)
      `);

    res.status(201).json({ message: 'Hearing date added!' });
    console.log("🔁 Added hearing for case:", caseId, "| Date:", hearingDate, "| Next:", nextHearingDate);
  } catch (err) {
    console.error('Add Hearing Date Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getHearingDatesByCase = async (req, res) => {
  const { caseId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('caseId', caseId)
      .query(`SELECT * FROM HearingDates WHERE caseId = @caseId ORDER BY hearingDate ASC`);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Fetch Hearing Dates Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};


  exports.getCaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', id)
      .query(`SELECT * FROM AddCase WHERE id = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('Get Case By ID Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};
