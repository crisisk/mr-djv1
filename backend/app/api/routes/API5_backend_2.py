// app.ts
import express from 'express';
import pricingRouter from './pricingRouter';

const app = express();
app.use(express.json());

app.use(pricingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
