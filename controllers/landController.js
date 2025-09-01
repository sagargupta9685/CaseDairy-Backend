const { poolPromise } = require('../utils/db');

// exports.addLandRecord = async (req, res) => {
//   const {
//     landId, location, area, ownershipDetails, land_type,
//     state_id, district_id, tehsil_id, rural_urban_area_id,
//     khasra_number, status, marketValue, remarks
//   } = req.body;

  
//   // const file_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

// const fileUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
//   const fileUrlsString = fileUrls.join(',');  // or save in another table if needed



//   try {
//     const pool = await poolPromise;
//     await pool.request()
//       .input('landId', landId)
//       .input('location', location)
//       .input('area', area)
//       .input('ownershipDetails', ownershipDetails)
//      .input('land_type', land_type)
//       .input('state_id', state_id)
//       .input('district_id', district_id)
//       // .input('tehsil_id', tehsil_id)
//       .input('tehsil_name', tehsil_id)
//     .input('area_type', rural_urban_area_id)
//       .input('khasra_number', khasra_number)
//       .input('status', status)
//       .input('marketValue', marketValue)
//       .input('remarks', remarks)
//       .input('file_url', fileUrlsString)
//       .query(`
//         INSERT INTO land_records (
//           landId, location, area, ownershipDetails, land_type, state_id,
//           district_id, tehsil_name, area_type, khasra_number, status,
//           marketValue, remarks, file_url
//         ) VALUES (
//           @landId, @location, @area, @ownershipDetails, @land_type, @state_id,
//           @district_id,  @tehsil_name, @area_type, @khasra_number, @status,
//           @marketValue, @remarks, @file_url
//         )
//       `);

//     res.status(201).json({ message: 'Land record added successfully!' });
//   } catch (err) {
//     console.error('Add Land Record Error:', err);
//     res.status(500).json({ error: 'Server Error' });
//   }
// };

exports.addLandRecord = async (req, res) => {
  console.log("Received Body:", req.body);
  console.log("Received Files:", req.files);

  const {
    landId, location, area, ownershipDetails, land_type,
    state_id, district_id, tehsil_id, rural_urban_area_id,
    khasra_number, status, marketValue, remarks
  } = req.body;

  const userId = parseInt(req.body.user_id, 10);
  if (!userId) {
    console.log("Invalid user_id received:", req.body.user_id);
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const fileUrls = (req.files || []).map(file => `http://localhost:5000/uploads/${file.filename}`);
  const fileUrlsString = fileUrls.join(',');

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('landId', landId)
      .input('location', location)
      .input('area', area)
      .input('ownershipDetails', ownershipDetails)
      .input('land_type', land_type)
      .input('state_id', state_id)
      .input('district_id', district_id)
      .input('tehsil_name', tehsil_id)        // make sure column name is tehsil_name
      .input('area_type', rural_urban_area_id) // or change to match DB column
      .input('khasra_number', khasra_number)
      .input('status', status)
      .input('marketValue', parseFloat(marketValue) || 0)
      .input('remarks', remarks)
      .input('file_url', fileUrlsString)
      .input('user_id', userId)
      .query(`
        INSERT INTO land_records (
          landId, location, area, ownershipDetails, land_type, state_id,
          district_id, tehsil_name, area_type, khasra_number, status,
          marketValue, remarks, file_url, user_id
        ) VALUES (
          @landId, @location, @area, @ownershipDetails, @land_type, @state_id,
          @district_id, @tehsil_name, @area_type, @khasra_number, @status,
          @marketValue, @remarks, @file_url, @user_id
        )
      `);

    res.status(201).json({ message: 'Land record added successfully!' });
  } catch (err) {
    console.error('Add Land Record Error:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.getStates = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM states ORDER BY name');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch states' });
  }
};

exports.getDistricts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('stateId', req.params.stateId)
      .query('SELECT * FROM districts WHERE state_id = @stateId ORDER BY name');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
};

exports.getTehsils = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('districtId', req.params.districtId)
      .query('SELECT * FROM tehsils WHERE district_id = @districtId ORDER BY name');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tehsils' });
  }
};

exports.getRuralUrbanAreas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('tehsilId', req.params.tehsilId)
      .query('SELECT * FROM  rural_urban_areas WHERE tehsil_id = @tehsilId ORDER BY name');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rural/urban areas' });
  }
};


// exports.getLandRecords = async(req,res)=>{
//   try{
//     const pool = await poolPromise;
//    const result = await pool.request()
//      .query(`
//   SELECT 
//     lr.landId,
//     lr.location,
//     lr.area,
//     lr.ownershipDetails,
//     lr.land_type,
//     s.name AS state_name,
//     d.name AS district_name,
//   lr.tehsil_name,
//   lr.area_type,
//     lr.status,
//     lr.marketValue,
//     lr.remarks,
//     lr.file_url
//   FROM land_records lr
//   LEFT JOIN states s ON lr.state_id = s.id
//   LEFT JOIN districts d ON lr.district_id = d.id
//     ORDER BY lr.created_at DESC
// `);
//     res.status(200).json(result.recordset);
//   }catch(err){
//     console.error('Fetch Land Records Error:', err);
//     res.status(500).json({ error: 'Server Error' });
//   }
// }
exports.getLandRecords = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', userId)
      .query(`
        SELECT 
          lr.landId, lr.location, lr.area, lr.ownershipDetails, lr.land_type,
          s.name AS state_name, d.name AS district_name,
          lr.tehsil_name, lr.area_type, lr.status, lr.marketValue, lr.remarks,
          lr.file_url
        FROM land_records lr
        LEFT JOIN states s ON lr.state_id = s.id
        LEFT JOIN districts d ON lr.district_id = d.id
        WHERE lr.user_id = @user_id
        ORDER BY lr.created_at DESC
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Fetch Land Records Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};
