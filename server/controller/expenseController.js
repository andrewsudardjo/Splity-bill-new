import Group from '../models/groupSchema.js';  
import Expense from "../models/expenseSchema.js";

export const getExpenses = async (req, res) => {
    try{
        const expense = await Expense.find({});
        res.status(200).json({expense : expense});
    }catch(err){
        console.log(err);
        res.status(404).json({message : "expense not found"});  
    }
}

export const getExpensesById = async (req, res) => {
    try{
        const { id } = req.params;
        const expense = await Expense.findById(id);

        res.status(200).json({expense: expense})
    }catch(err){
        console.log(err);
        res.status(404).json({message: "expense not found"});
    }
    
}

export const addExpenses = async (req, res) => {
    try {
        const { description, amount, paidBy, splitBetween } = req.body;
        const { groupId } = req.params;

        if (!description || !amount || !paidBy || !splitBetween) {
            return res.status(400).send('Missing required details');
        }

        const selectedMembers = Array.isArray(splitBetween) ? splitBetween : [splitBetween];
        const shareAmount = Number((amount / splitBetween.length)).toFixed(2);

        const splitDetails = selectedMembers.map(member => ({
            member,
            share: shareAmount
        }));

        const expense = new Expense({
            groupId: groupId,
            description,
            amount: Number(amount),
            paidBy,
            splitBetween: splitDetails
        });

        await expense.save();

        await Group.findByIdAndUpdate(groupId, {
            $push: { expenses: expense._id }
        });

        res.status(200).json({
            message: "Expense added successfully",
            expense: expense,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding expenses'});
    }
};

export const editExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;  
        const { description, amount, paidBy, splitBetween } = req.body;  

        if (!description || !amount || !paidBy || !splitBetween) {
            return res.status(400).send('Missing required details');
        }

        const formattedSplitBetween = splitBetween.map(member => ({
            member,  
            share: amount / splitBetween.length  
        }));
        
        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            {
                description,
                amount: Number(amount),
                paidBy,
                splitBetween: formattedSplitBetween  
            },
            { new: true }  
        );

        if (!updatedExpense) {
            return res.status(404).send('Expense not found');
        }

        res.status(200).json({ message: "Expense updated successfully"});
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).send('Error editing expense');
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;

        // Find and delete the expense
        const expense = await Expense.findByIdAndDelete(expenseId);

        if (!expense) {
            return res.status(404).send('Expense not found');
        }

        // Update the group to remove the expense reference
        await Group.findByIdAndUpdate(expense.groupId, {
            $pull: { expenses: expense._id }
        });

        res.status(200).json({ message: "Expense deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting expense');
    }
};
