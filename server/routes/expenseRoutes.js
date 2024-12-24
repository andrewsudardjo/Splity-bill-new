import { Router } from 'express';
import { addExpenses, deleteExpense, getExpenses, editExpense, getExpensesById } from "../controller/expenseController.js"

const router = Router();
router.get('/getexpense', getExpenses);
router.get('/getexpense/:id', getExpensesById);
router.post('/addexpense/:groupId', addExpenses);
router.put('/editexpense/:expenseId', editExpense);
router.delete('/delete/:expenseId', deleteExpense);

export default router;
