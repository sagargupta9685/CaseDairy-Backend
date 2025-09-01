const { poolPromise } = require('../utils/db');

// exports.addCase = async (req, res) => {
//   const {
//     title,
//     caseNo,
//     caseDate,
//     description,
//     notificationDays,
//     caseType,
//     caseCourt,    
//     state,
//     address,
//     againstCase,
//     plaintiff,
//     defender
//   } = req.body;

//   const userId = req.user.id; 
//   const documentPath = req.file ? req.file.filename : null;

//   if (
//     !title || !caseNo || !caseDate || !description || !notificationDays || !caseType ||
//     !caseCourt || !state || !address || !againstCase || !plaintiff || !defender
//   ) {
//     return res.status(400).json({ error: 'All fields are mandatory' });
//   }

//   try {
//     const pool = await poolPromise;

//     await pool.request()
//       .input('userId', userId)
//       .input('court', caseCourt)
//       .input('forum', caseCourt) // you can split court & forum if needed
//       .input('caseType', caseType)
//       .input('caseNo', caseNo)
//       .input('caseDate', caseDate)
//       .input('title', title)
//       .input('shortDescription', description)
//       .input('plaintiff', plaintiff)
//       .input('defender', defender)
//       .input('address', address)
//       .input('documentPath', documentPath)
//       .input('status', 'Pending') // default value
//       .query(`
//         INSERT INTO AddCase (
//           userId, court, forum, caseType, caseNo, caseDate, title,
//           shortDescription, plaintiff, defender, address, documentPath, status
//         ) VALUES (
//           @userId, @court, @forum, @caseType, @caseNo, @caseDate, @title,
//           @shortDescription, @plaintiff, @defender, @address, @documentPath, @status
//         )
//       `);

//     res.status(201).json({ message: 'Case added successfully' });
//   } catch (err) {
//     console.error('Add Case Error:', err);
//     res.status(500).json({ error: 'Server Error' });
//   }
// };


exports.addCase = async (req, res) => {
  const {
    court,
    forum,
    caseType,
    caseNo,
    caseDate,
    title,
    shortDescription,
    plaintiff,
    defender,
    address
  } = req.body;

  const userId = req.user.id;

  // ✅ Handle multiple files
  const files = req.files;
  const documentPaths = files.map(file => file.filename).join(',');

  // ✅ Validate required fields
  if (
    !court || !forum || !caseType || !caseNo || !caseDate ||
    !title || !shortDescription || !plaintiff || !defender || !address
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('userId', userId)
      .input('court', court)
      .input('forum', forum)
      .input('caseType', caseType)
      .input('caseNo', caseNo)
      .input('caseDate', caseDate)
      .input('title', title)
      .input('shortDescription', shortDescription)
      .input('plaintiff', plaintiff)
      .input('defender', defender)
      .input('address', address)
      .input('documentPath', documentPaths) // comma separated file names
      .input('status', 'Pending') // default value
      .query(`
        INSERT INTO AddCase (
          userId, court, forum, caseType, caseNo, caseDate, title,
          shortDescription, plaintiff, defender, address, documentPath, status
        ) VALUES (
          @userId, @court, @forum, @caseType, @caseNo, @caseDate, @title,
          @shortDescription, @plaintiff, @defender, @address, @documentPath, @status
        )
      `);

    res.status(201).json({ message: 'Case added successfully' });
  } catch (err) {
    console.error('Add Case Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};





exports.getAllCasesByUser = async (req, res) => {
  const { userId } = req.params;
  console.log("user:",userId);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', userId)
      .query(`SELECT * FROM AddCase WHERE userId = @userId ORDER BY caseDate ASC`);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Get AddCase Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};



 



exports.updateCaseStatus = async (req, res) => {
  const caseId = req.params.id;
  const { status } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('status', status)
      .input('id', caseId)
      .query('UPDATE AddCase  SET status = @status WHERE id = @id');

    res.status(200).json({ message: 'Case status updated successfully' });
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
