# Tools & Games Cabinet

Personal catalog for useful tools, AI services, and quick games.

## Files

- `index.html` - page structure
- `styles.css` - visual design and responsive layout
- `data.js` - categories and links
- `app.js` - filtering, sorting, ratings, visits, favorites-ready behavior
- `firebase-config.js` - admin email and future Firebase setup values

## Current phase

This version is still static and stores data in the browser. It now includes demo/local versions of profiles, favorites, hidden apps, submissions, and admin approval.

Before uploading, change `adminEmail` in `firebase-config.js` to your Gmail address. The next phase will connect these same screens to Firebase for real Google login and shared data.
