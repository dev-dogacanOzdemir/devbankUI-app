# devbank-UI  

<p align="center">
  <img width="800" height="400" src="src/assets/devbankLogoTitleWhite.png">
</p>

## 📌 **Proje Açıklaması**  

**DevBank UI**, bankacılık işlemlerini yönetmek için geliştirilen kullanıcı dostu bir arayüz sunar. Bu proje, **React (TypeScript)** ile geliştirilmiş olup, state yönetimi için **Redux Toolkit**, UI bileşenleri için **Mantine UI** kullanmaktadır.  

**Özellikler:**  
👉 Kullanıcı ve admin panelleri  
👉 Hesap, kart, transfer ve para birimi yönetimi  
👉 Yetkilendirme ve oturum yönetimi  
👉 API ile tam entegrasyon (Proxy API)  

---

## 📌 **İçindekiler**  
- [📌 Gereksinimler](#gereksinimler)  
- [📌 Kurulum](#kurulum)  
- [📌 Uygulamayı Çalıştırma](#uygulamayi-calistirma)  
- [📌 Proje Yapısı](#proje-yapisi)  

---

## 📌 **Gereksinimler**  

- **Node.js**: 20.13.1 ve üstü  
- **npm / yarn**: Paket yöneticisi olarak biri kullanılmalı  
- **React**: 18.x  
- **TypeScript**  
- **Mantine UI**  

---

## 📌 **Kurulum**  

Öncelikle, projenin bağımlılıklarını yükleyin:  

```bash
npm install
# veya
yarn install
```

Proxy API'yi çalıştırmak için:  
```bash
cd proxy-api
npm install
node server.js
```

---

## 📌 **Uygulamayı Çalıştırma**  

1. **Geliştirme Modunda Çalıştırma**  
```bash
npm run dev
# veya
yarn dev
```
Tarayıcınızda `http://localhost:5173` adresini ziyaret edin.  

2. **Build Alma**  
```bash
npm run build
# veya
yarn build
```

---

## 📌 **Proje Yapısı**  

```plaintext
devbankUI-app
├── proxy-api
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
├── src
│   ├── assets
│   │   ├── devbankLogoWhite.png
│   │   ├── devbankLogoBlack.png
│   ├── components
│   │   ├── admin
│   │   │   ├── AccountTypesTable.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── LastLoginsTable.tsx
│   │   │   ├── LastTransfersTable.tsx
│   │   │   ├── TransferStatusTable.tsx
│   │   │   ├── UserRolesTable.tsx
│   │   ├── customer
│   │   │   ├── Layout.tsx
│   │   │   ├── LeadGrid.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── NavbarSimpleColored.tsx
│   ├── hooks
│   │   ├── useAuth.tsx
│   ├── pages
│   │   ├── admin
│   │   │   ├── AdminAccountsPage.tsx
│   │   │   ├── AdminCardsPage.tsx
│   │   │   ├── AdminCurrencyGoldPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── AdminLoansPage.tsx
│   │   │   ├── AdminTransfersPage.tsx
│   │   ├── customer
│   │   │   ├── CustomerAccountsPage.tsx
│   │   │   ├── CustomerCardsPage.tsx
│   │   │   ├── CustomerCurrencyGoldPage.tsx
│   │   │   ├── CustomerDashboardPage.tsx
│   │   │   ├── CustomerLoansPage.tsx
│   │   │   ├── CustomerTransfersPage.tsx
│   │   ├── LoginPage.tsx
│   ├── types
│   │   ├── DashboardTypes.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.cjs
│   ├── README.md
│   ├── tsconfig.json
│   ├── vite.config.ts
```

---

## 📌 **Geliştirme Süreci**  

Bu proje, bir bitirme projesi olarak geliştirilmekte olup hâlâ aktif olarak güncellenmektedir. Zaman içinde yeni özellikler ve iyileştirmeler eklenmesi planlanmaktadır. Kullanıcı geri bildirimleri doğrultusunda geliştirmeler devam edecek ve proje daha kararlı bir hale getirilecektir. Güncellemeleri takip etmek için depoyu izleyebilirsiniz.  

---

## 📌 **Lisans**  

Bu proje **MIT Lisansı** ile lisanslanmıştır.  

---


