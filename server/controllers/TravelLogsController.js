import pool from "../db.js";
const testID = 1
// 測試連線
pool.connect()
  .then(() => console.log('✅ PostgreSQL 連線成功!'))
  .catch(err => console.error('❌ PostgreSQL 連線失敗!', err));

// PostgreSQL版
const getAllTravelLogs = async (req, res) => {
	try {
		const newRows = await getFormattedLogs(testID);
		if (newRows.length === 0) {
			return res.status(404).json({ success: false, error: "沒有找到任何紀錄" });
		}
		res.status(200).json({ success: true, logs: newRows });
	} catch (error) {
		console.error("fetch失敗", error);
		res.status(500).json({ success: false, error: "網路錯誤。" });
	}
};

const addTravelLog = async (req, res) => {
	try {
		const { valid, message } = validateForm(req.body);
		if (!valid) return res.status(400).json({ error: message });

		const { name, address, category, rating, description, visitDate, coordinate } = req.body;
		const { lat, lng } = coordinate;

		const insertResult = await pool.query(
			`INSERT INTO travel_logs 
			(user_id, name, address, category, rating, description, lat, lng, visit_date) 
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
			[testID, name, address, category, rating, description, lat, lng, visitDate]
		);

		const insertId = insertResult.rows[0].id;
		const rowResult = await pool.query("SELECT * FROM travel_logs WHERE id = $1 AND user_id = $2", [insertId,testID]);
		const newRows = await getFormattedLogs(testID);

		res.status(201).json({ success: true, msg: `${rowResult.rows[0].name} 新增成功`, logs: newRows });
	} catch (error) {
		console.error("fetch失敗", error);
		res.status(500).json({ error: "網路錯誤。" });
	}
};

const editTravelLog = async (req, res) => {
	try {
		const { valid, message } = validateForm(req.body);
		if (!valid) return res.status(400).json({ error: message });

		const editId = req.params.id;
		const checkRow = await pool.query("SELECT id FROM travel_logs WHERE id = $1 AND user_id = $2", [editId, testID]);

		if (checkRow.rows.length === 0) return res.status(404).json({ error: "找不到該筆資料" });

		const { category, rating, description, visitDate, coordinate: { lat, lng } } = req.body;

		const updateResult = await pool.query(
			`UPDATE travel_logs 
			 SET category = $1, rating = $2, description = $3, visit_date = $4, lat = $5, lng = $6 
			 WHERE user_id = $7 AND id = $8`,
			[category, rating, description, visitDate, lat, lng, testID, editId]
		);

		if (updateResult.rowCount > 0) {
			const newRows = await getFormattedLogs(testID);
			res.status(200).json({ success: true, msg: "編輯成功。", logs: newRows });
		} else {
			res.status(400).json({ success: false, error: "編輯失敗。" });
		}
	} catch (error) {
		console.error("fetch失敗", error);
		res.status(500).json({ success: false, error: "網路錯誤。" });
	}
};

const delTravelLog = async (req, res) => {
	try {
		const delId = req.params.id;
		const checkRow = await pool.query("SELECT id FROM travel_logs WHERE id = $1 AND user_id = $2", [delId, testID]);

		if (checkRow.rows.length === 0) return res.status(404).json({ success: false, error: "找不到該筆資料。" });

		const deleteResult = await pool.query("DELETE FROM travel_logs WHERE user_id = $1 AND id = $2", [testID, delId]);

		if (deleteResult.rowCount === 0) return res.status(400).json({ success: false, error: "刪除失敗。" });

		const newRows = await getFormattedLogs(testID);
		res.status(200).json({ success: true, msg: "刪除成功。", logs: newRows });
	} catch (error) {
		console.error("fetch失敗", error);
		res.status(500).json({ success: false, error: "網路錯誤。" });
	}
};

const getCategory = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM travel_log_category");
		res.json(result.rows);
	} catch (error) {
		console.error("fetch失敗", error);
		res.status(500).json({ success: false, error: "網路錯誤。" });
	}
};

const validateForm = (data) => {
	const { visitDate, category, rating, description, name, address, coordinate } = data;
	const missingFields = [];
	const invalidFields = [];
	if (!visitDate) missingFields.push("到訪日期");
	if (!category) missingFields.push("類別");
	if (!rating) missingFields.push("評分");
	if (!description) missingFields.push("回憶碎片");
	if (!name) missingFields.push("名稱");
	if (!address) missingFields.push("地址");
	if (description.length > 150) invalidFields.push("回憶碎片請勿超過 150 字");
	if (!coordinate || !coordinate.lat || !coordinate.lng) invalidFields.push("取得座標錯誤，請再選取一次地點");
	if (typeof rating !== "number" || rating < 1 || rating > 3) invalidFields.push("評分錯誤");

	if (missingFields.length > 0) return { valid: false, message: `請填寫：${missingFields.join("、")}` };
	if (invalidFields.length > 0) return { valid: false, message: `格式錯誤：${invalidFields.join("、")}` };

	return { valid: true };
};

const getFormattedLogs = async (userID = 1) => {
	const result = await pool.query("SELECT * FROM travel_logs WHERE user_id = $1", [userID]);
	return result.rows.map((item) => {
		const { lat, lng, visit_date, ...rest } = item;
		return {
			...rest,
			coordinate: { lat, lng },
			visitDate: new Date(visit_date).toLocaleDateString("sv-SE", {
				timeZone: "Asia/Taipei",
			}),
		};
	});
};

export default {
	getAllTravelLogs,
	addTravelLog,
	editTravelLog,
	delTravelLog,
	getCategory,
};
