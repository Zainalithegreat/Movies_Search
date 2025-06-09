// copy-redirects.js
import { copyFileSync } from 'fs';

try {
    copyFileSync('public/_redirects', 'dist/_redirects');
    console.log('✅ Copied _redirects to dist/');
} catch (err) {
    console.error('❌ Failed to copy _redirects:', err);
}
