import express from 'express';
import cors from 'cors';
import travelLogsRoutes from './routes/travelLogs.js'; // 引入你的路由檔案
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
const port = 3000

const app = express();
// console.log(cors)
// 允許來自所有網域的跨域請求 (僅用於開發環境)
app.use(cors());
app.use(express.json()); // 解析 JSON 請求體
// const corsOptions = {
//   origin: 'http://localhost:5173'
// };
// 只允許來自特定網域的跨域請求 (生產環境)
// app.use(cors(corsOptions));

// 
app.use('/api',travelLogsRoutes)

app.listen(port, () => {
	console.log("已運行在" + port);
});
