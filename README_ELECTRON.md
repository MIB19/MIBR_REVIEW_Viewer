# MIBR Review Viewer - Electron Version

## Cara Menjalankan

### Mode Development (Rekomendasi untuk Review)

```bash
npm run electron-dev
```

Command ini akan:

1. Start Vite dev server di port 9898
2. Otomatis membuka Electron window setelah server ready
3. Enable hot reload untuk perubahan code
4. Buka DevTools otomatis

### Mode Production

```bash
# Build aplikasi
npm run build

# Jalankan Electron production
npm run electron
```

## Fitur Electron

✅ **No CORS/X-Frame-Options Issues**

- Semua website bisa dimuat dalam iframe, termasuk `https://localhost:3000`
- Bypass otomatis untuk header security yang memblokir iframe

✅ **Web Security Disabled untuk Dev**

- Bisa load konten dari localhost tanpa SSL certificate error
- Support untuk insecure content (mixed HTTP/HTTPS)

✅ **DevTools Included**

- Inspect iframe content
- Debug network requests
- Console logging

## Perbedaan dengan Browser

- Tidak ada CORS restrictions
- Tidak ada X-Frame-Options blocking
- Tidak ada CSP (Content Security Policy) yang memblokir
- Full access ke localhost development servers

## Build Distribusi

```bash
npm run package
```

File executable akan ada di folder `release/`

## Troubleshooting

**Jika Electron tidak membuka:**

- Pastikan port 9898 tidak digunakan aplikasi lain
- Cek terminal untuk error messages

**Jika masih loading terus:**

- Pastikan `https://localhost:3000` benar-benar running
- Cek DevTools (F12) untuk error messages
- Pastikan SSL certificate di localhost:3000 valid atau self-signed
