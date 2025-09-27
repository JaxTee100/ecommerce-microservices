import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

app.listen(PORT, () => {
  console.log(`API Gateway is listening on port ${PORT}`);
});