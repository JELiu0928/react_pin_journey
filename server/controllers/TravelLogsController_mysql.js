import pool from "../db.js";
const testID = 1;

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
		if (!valid) {
			return res.status(400).json({ error: message });
		}
		const { name, address, category, rating, description, visitDate, coordinate } = req.body;
		const { lat, lng } = coordinate;
		const [result] = await pool.query("INSERT INTO travel_logs (user_id, name, address, category, rating, description, lat, lng, visit_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [testID, name, address, category, rating, description, lat, lng, visitDate]);
		// console.log("addTravelLog-result", result);
		if (result.affectedRows > 0) {
			// 藉由 result.insertId 取得剛插入的資料的 ID，回傳名稱給前端
			const [rows] = await pool.query("select * from travel_logs where id = ? ", [result.insertId]);
			const newRows = await getFormattedLogs(testID);
			const insertLocalName = rows[0].name;

			res.status(201).json({ success: true, msg: `${insertLocalName} 新增成功`, logs: newRows });
		} else {
			res.status(400).json({ success: false, error: "新增失敗" });
		}
	} catch (error) {
		console.error("fetch失敗", error);
		res.status(500).json({ error: "網路錯誤。" });
	}
};
const editTravelLog = async (req, res) => {
	try {
		const { valid, message } = validateForm(req.body);
		if (!valid) {
			return res.status(400).json({ error: message });
		}
		const editId = req.params.id;
		const [checkRow] = await pool.query("SELECT id FROM travel_logs WHERE id = ? AND user_id = 1", [editId]);
		if (checkRow.length === 0) {
			return res.status(404).json({ error: "找不到該筆資料" });
		}

		const {
			category,
			rating,
			description,
			visitDate,
			coordinate: { lat, lng },
		} = req.body;

		const [result] = await pool.query("UPDATE travel_logs SET category = ?, rating = ?, description = ?, visit_date = ? ,lat = ?,lng = ? WHERE user_id = 1 and id = ?  ", [category, rating, description, visitDate, lat, lng, editId]);
		// console.log("editTravelLog-result", result);
		if (result.affectedRows > 0) {
			const newRows = await getFormattedLogs(1);
			res.status(200).json({ success: true, msg: "編輯成功。", logs: newRows });
		} else {
			res.status(400).json({ success: false, error: "編輯失敗。" });
		}
	} catch (error) {
		// console.error("fetch失敗", error);
		res.status(500).json({ success: false, error: "網路錯誤。" });
	}
};
const delTravelLog = async (req, res) => {
	try {
		const delId = req.params.id;
		const [checkRow] = await pool.query("SELECT id FROM travel_logs WHERE id = ? AND user_id = 1", [delId]);
		if (checkRow.length === 0) return res.status(404).json({ success: false, error: "找不到該筆資料。" });

		const [result] = await pool.query("DELETE FROM travel_logs WHERE user_id = 1 AND id = ?", [delId]);
		if (result.affectedRows === 0) res.status(400).json({ success: false, error: "刪除失敗。" });

		const newRows = await getFormattedLogs(1);
		res.status(200).json({ success: true, msg: "刪除成功。", logs: newRows });
	} catch (error) {
		console.error("fetch失敗", error);
		res.status(500).json({ success: false, error: "網路錯誤。" });
	}
};

const getCategory = async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM travel_log_category");
		if (rows) {
			res.json(rows);
		}
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
	if (description.length > 150) {
		invalidFields.push("回憶碎片請勿超過 150 字");
	}
	if (!coordinate || !coordinate.lat || !coordinate.lng) invalidFields.push("取得座標錯誤，請再選取一次地點");
	if (typeof rating !== "number" || rating < 1 || rating > 3) invalidFields.push("評分錯誤");
	if (missingFields.length > 0) {
		return {
			valid: false,
			message: `請填寫：${missingFields.join("、")}`,
		};
	}
	if (invalidFields.length > 0) {
		return {
			valid: false,
			message: `格式錯誤：${invalidFields.join("、")}`,
		};
	}
	return { valid: true };
};
const getFormattedLogs = async (userID = 1) => {
	const [rows] = await pool.query("SELECT * FROM travel_logs WHERE user_id = ?", [userID]);
	return rows.map((item) => {
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
