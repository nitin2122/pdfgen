# PDFGen Suite Pro 📄✨

A comprehensive, production-grade document management and PDF processing platform. Built for speed, efficiency, and professional-level document handling.

[![GitHub license](https://img.shields.io/github/license/nitin2122/pdfgen)](https://github.com/nitin2122/pdfgen/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/nitin2122/pdfgen)](https://github.com/nitin2122/pdfgen/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/nitin2122/pdfgen)](https://github.com/nitin2122/pdfgen/issues)

## 🚀 Live Demo
Check out the live application here: [https://pdfgen-suite-pro.web.app](https://pdfgen-suite-pro.web.app)

---

## 🔥 Features

### 🛠️ Advanced PDF Processing
- **PDF Conversion**: Seamlessly convert images, Word documents (`.docx`), and PowerPoint presentations (`.pptx`) to high-quality PDF files.
- **PDF Editing**: Modify existing PDF documents, add text, and reorder pages with ease.
- **Optical Character Recognition (OCR)**: Extract text from images and scanned documents using integrated `Tesseract.js` technology.

### 📝 Professional Invoice Generation
- **Dynamic Forms**: Create professional invoices with custom fields, branding, and real-time previews.
- **Export to PDF**: Generate pixel-perfect PDF invoices ready for download or sharing.

### 🔐 Secure & Personalized
- **Firebase Authentication**: Secure Google Sign-In and email/password authentication.
- **User History**: Keep track of your processed documents and generation history with Firestore-backed data persistence.
- **Responsive Design**: A premium, dark-mode inspired UI that looks stunning on mobile, tablet, and desktop.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with modern Glassmorphism & Micro-animations
- **Backend/Auth**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Hosting)
- **Document Libraries**:
  - `pdf-lib` for PDF manipulation
  - `docx` & `mammoth` for Word processing
  - `pptxgenjs` for PowerPoint generation
  - `tesseract.js` for OCR
  - `html2canvas` for UI-to-image exports

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nitin2122/pdfgen.git
   cd pdfgen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run in Development Mode**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🏗️ Deployment

The project is configured for one-click deployment to **Firebase Hosting**.

```bash
npm run build
firebase deploy
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Nitin](https://github.com/nitin2122)
