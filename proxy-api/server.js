const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// Uygulama Ayarları
const app = express();
const port = 5000; // Proxy API'nin çalışacağı port
const mongoURI = 'mongodb://localhost:27017/devbank'; // MongoDB bağlantı URI'si
const dbName = 'devbank'; // MongoDB veritabanı adı

app.use(cors()); // CORS sorunlarını çözmek için
app.use(express.json()); // JSON verileri işlemek için

// MongoDB Bağlantı
let db;
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
    .then((client) => {
        db = client.db(dbName);
        console.log(`MongoDB bağlantısı kuruldu: ${dbName}`);
    })
    .catch((error) => {
        console.error('MongoDB bağlantı hatası:', error);
    });

// Toplam Kullanıcı Sayısı
app.get('/api/dashboard/total-users', async (req, res) => {
    try {
        const count = await db.collection('users').countDocuments();
        res.json({ totalUsers: count });
    } catch (error) {
        res.status(500).json({ error: 'Hata: Kullanıcı sayısı alınamadı.' });
    }
});

// Toplam Hesap Sayısı
app.get('/api/dashboard/total-accounts', async (req, res) => {
    try {
        const count = await db.collection('accounts').countDocuments();
        res.json({ totalAccounts: count });
    } catch (error) {
        res.status(500).json({ error: 'Hata: Hesap sayısı alınamadı.' });
    }
});

// Hesap Türlerine Göre Sayılar
app.get('/api/dashboard/accounts-by-type', async (req, res) => {
    try {
        const result = await db.collection('accounts').aggregate([
            { $group: { _id: '$accountType', count: { $sum: 1 } } }
        ]).toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Hata: Hesap türleri alınamadı.' });
    }
});

// Kullanıcı Rollerine Göre Sayılar
app.get('/api/dashboard/users-by-role', async (req, res) => {
    try {
        const result = await db.collection('users').aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]).toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Hata: Kullanıcı rolleri alınamadı.' });
    }
});

// Transfer Durumlarına Göre Sayılar
app.get('/api/dashboard/transfers-by-status', async (req, res) => {
    try {
        const result = await db.collection('transfers').aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Hata: Transfer durumları alınamadı.' });
    }
});

// Toplam Giriş Sayısı
app.get('/api/dashboard/total-logins', async (req, res) => {
    try {
        const count = await db.collection('login-info').countDocuments();
        res.json({ totalLogins: count });
    } catch (error) {
        res.status(500).json({ error: 'Hata: Giriş sayısı alınamadı.' });
    }
});
//Toplam özeti
app.get('/api/dashboard/summary', async (req, res) => {
    try {
        const totalUsers = await db.collection('users').countDocuments();
        const totalAccounts = await db.collection('accounts').countDocuments();
        const totalTransfers = await db.collection('transfers').countDocuments();
        const totalLogins = await db.collection('login-info').countDocuments();

        res.json({
            totalUsers,
            totalAccounts,
            totalTransfers,
            totalLogins,
        });
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Son 10 Transfer
app.get('/api/dashboard/last-transfers', async (req, res) => {
    try {
        const result = await db.collection('transfers')
            .find()
            .sort({ transferTime: -1 }) // Tarihe göre sıralama (en yeni)
            .limit(10) // Son 10 transfer
            .project({
                senderAccountId: 1,
                receiverAccountId: 1,
                amount: 1,
                description: 1,
                status: 1,
                transferTime: 1,
                _id: 0
            }) // İlgili alanlar
            .toArray();
        const formattedResult = result.map((transfer) => ({
            sender: transfer.senderAccountId,
            receiver: transfer.receiverAccountId,
            amount: transfer.amount,
            description: transfer.description,
            status: transfer.status,
            date: new Date(transfer.transferTime).toLocaleString(),
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ error: 'Hata: Son transferler alınamadı.' });
    }
});

// Son Giriş Bilgileri
app.get('/api/dashboard/last-logins', async (req, res) => {
    try {
        const result = await db.collection('login-info')
            .find()
            .sort({ loginTime: -1 }) // Tarihe göre sıralama (en yeni)
            .limit(10) // Son 10 giriş
            .project({
                userId: 1,
                ipAddress: 1,
                loginTime: 1,
                _id: 0
            }) // İlgili alanlar
            .toArray();
        const formattedResult = result.map((login) => ({
            userId: login.userId,
            ipAddress: login.ipAddress,
            loginTime: new Date(login.loginTime).toLocaleString(),
        }));
        res.json(formattedResult);
    } catch (error) {
        res.status(500).json({ error: 'Hata: Son giriş bilgileri alınamadı.' });
    }
});

// 🏦 Müşteriye ait hesapları getir
app.get('/api/customers/:customerId/accounts', async (req, res) => {
    try {
        const customerId = req.params.customerId;

        const accounts = await db.collection('accounts').find({ customerId }).toArray();

        if (!accounts.length) {
            return res.json([]); // Hesap yoksa boş liste dön
        }

        res.json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Müşterinin kartlarını getirme
app.get('/api/customers/:customerId/cards', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const cards = await db.collection('cards').find({ userId: customerId }).toArray();

        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Hata: Kartlar alınamadı.' });
    }
});

// Müşterinin kredi bilgilerini getirme
app.get('/api/customers/:customerId/loans', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const loans = await db.collection('loans').find({ customerId }).toArray();
        res.json(loans);
    } catch (error) {
        res.status(500).json({ error: 'Hata: Krediler alınamadı.' });
    }
});

//Müşterinin transferlerini getirme
app.get('/api/customers/:customerId/transfers', async (req, res) => {
    try {
        const customerId = req.params.customerId;

        // Müşterinin hesaplarını bul
        const accounts = await db.collection('accounts').find({ customerId }).toArray();

        // Hesap ID'lerini çıkart
        const accountIds = accounts.map(acc => acc._id.toString());

        // Transferleri getir
        const transfers = await db.collection('transfers').find({
            $or: [
                { senderAccountId: { $in: accountIds } },
                { receiverAccountId: { $in: accountIds } }
            ]
        }).toArray();

        res.json(transfers);
    } catch (error) {
        console.error('🔥 Hata:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Müşteri bilgilerini getirme
app.get('/api/customers/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;

        // Kullanıcı bilgilerini çek
        const user = await db.collection('users').findOne({ _id: customerId });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ name: user.name, surname: user.surname });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Sunucuyu Başlat
app.listen(port, () => {
    console.log(`Proxy API, http://localhost:${port} adresinde çalışıyor.`);
});
