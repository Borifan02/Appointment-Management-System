# ⚡ Quick Start Guide

## Get Running in 3 Minutes

### Step 1: Install Dependencies (1 min)
```bash
cd Appointment-Management-System
npm install
```

### Step 2: Start Development Server (30 sec)
```bash
npm start
```

### Step 3: Open in Browser (30 sec)
```
http://localhost:3000
```

## First Time Setup

### What You'll See
1. **Statistics Dashboard** - Shows 0 appointments initially
2. **Appointment Form** - Ready to add your first appointment
3. **Empty List** - "No appointments found" message

### Add Your First Appointment
1. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com" (optional)
   - Phone: "1234567890" (optional)
   - Date: Select tomorrow's date
   - Time: Select any time
2. Click "Add Appointment"
3. See it appear in the list below!

## Try These Features

### 🔍 Search
- Type a name in the search box
- Watch the list filter instantly

### 🎯 Filter
- Use the status dropdown
- Filter by Pending/Completed/Cancelled

### 📊 Sort
- Try sorting by Date, Name, or Status
- See the list reorganize

### ✏️ Edit
- Click the edit (✏️) button
- Modify any field
- Click save (💾)

### ✅ Complete
- Click the checkmark (✅) on a pending appointment
- Status changes to "Completed"

### 🗑️ Delete
- Click the delete (🗑️) button
- Appointment is removed

### 📥 Export
- Add a few appointments
- Click "Export CSV"
- Open the downloaded file

### 🌓 Dark Mode
- Click the moon (🌙) icon in header
- Toggle between light and dark themes

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Then restart
npm start
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Page Not Loading
- Check console for errors
- Ensure Node.js version is 14+
- Try clearing browser cache

## Development Tips

### Hot Reload
- Save any file to see changes instantly
- No need to refresh browser

### Browser DevTools
- Press F12 to open developer tools
- Check Console for any errors
- Use React DevTools extension

### Testing Changes
1. Make code changes
2. Save file
3. Browser auto-refreshes
4. Test the feature

## Next Steps

1. ✅ Run the application
2. ✅ Add sample appointments
3. ✅ Test all features
4. ✅ Try dark mode
5. ✅ Export data to CSV
6. 📖 Read full README.md
7. 🚀 Deploy to production
8. 💼 Add to your portfolio

## Need Help?

- Check README.md for detailed documentation
- Review FEATURES.md for feature explanations
- See TESTING.md for testing guidelines
- Read PORTFOLIO_GUIDE.md for presentation tips

## Build for Production

```bash
npm run build
```

Creates optimized production build in `/build` folder.

## Deploy

See DEPLOYMENT.md for deployment instructions to:
- Vercel
- Netlify
- GitHub Pages

---

**You're all set! Start building your portfolio project! 🚀**
