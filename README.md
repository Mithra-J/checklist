# February 2026 Task Scheduler

A simple, interactive task scheduler for tracking daily learning progress across multiple platforms.

## Features

- **Multi-Platform Tracking**: LeetCode, GeeksforGeeks, Coding Ninja, CodeChef, Duolingo, Mimo, and more
- **Dual Views**: Switch between table and card layouts
- **Progress Stats**: Track completion rate, streaks, and daily scores
- **Month Navigation**: Navigate between months with persistent data storage
- **Auto-Save**: Progress automatically saved to browser localStorage

## Quick Start

1. Clone the repository
2. Open `index.html` in your browser
3. Start tracking your tasks!

No installation or dependencies required.

## Usage

- **Mark Complete**: Click any platform icon to toggle task status
- **Change Month**: Use navigation buttons or arrow keys
- **Export Data**: Download your progress as JSON
- **Switch View**: Toggle between table and card layouts

## File Structure
```
├── index.html    # Main application
├── styles.css    # Styling
├── script.js     # Logic & interactivity
└── README.md     # Documentation
```

## Customization

### Add a Platform

Edit the `PLATFORMS` array in `script.js`:
```javascript
const PLATFORMS = [
  { id: 'myPlatform', name: 'Platform Name', icon: 'fas fa-icon', color: '#COLOR' }
];
```

### Change Colors

Modify CSS custom properties in `styles.css`:
```css
:root {
  --primary-color: #your-color;
}
```

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## License

Open source - free for personal and educational use.
