const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/TreeShop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const treeSchema = new mongoose.Schema({
    treename: String,
    description: String,
    image: String
});

const Tree = mongoose.model('TreeCollection', treeSchema);

// Cấu hình multer để lưu file ảnh
const storage = multer.diskStorage({
    destination: './public/uploads/', // Lưu file vào thư mục public/uploads
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Trang chủ - Hiển thị danh sách cây
app.get('/', async (req, res) => {
    const trees = await Tree.find();
    res.render('index', { trees });
});

// Xử lý thêm cây
app.post('/add', upload.single('image'), async (req, res) => {
    const { treename, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : ''; // Lưu đường dẫn ảnh

    if (!treename || !description) {
        return res.send("Tree Name and Description are required!");
    }

    await Tree.create({ treename, description, image });
    res.redirect('/');
});

// Xóa tất cả cây (Reset)
app.post('/reset', async (req, res) => {
    await Tree.deleteMany({});
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Xóa cây theo ID
app.post('/delete/:id', async (req, res) => {
    await Tree.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Hiển thị trang chỉnh sửa cây
app.get('/edit/:id', async (req, res) => {
    const tree = await Tree.findById(req.params.id);
    res.render('edit', { tree });
});

// Cập nhật cây sau khi chỉnh sửa
app.post('/edit/:id', async (req, res) => {
    const { treename, description } = req.body;
    await Tree.findByIdAndUpdate(req.params.id, { treename, description });
    res.redirect('/');
});

// Route để hiển thị trang About Me
app.get('/about', (req, res) => {
    res.render('about');
});

