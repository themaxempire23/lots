import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.CORS_ORIGINS) {
    console.log(`CORS allowed origins: ${process.env.CORS_ORIGINS}`);
  } else {
    console.log('CORS allowed origin default: http://localhost:5173');
  }
});
