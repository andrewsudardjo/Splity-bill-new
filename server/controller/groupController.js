import Group from "../models/groupSchema.js";
import Expense from "../models/expenseSchema.js";
import { calculateFinances } from "../utils/calculateFinances.js";

export const getGroup = async (req, res) => {
    try {
        const group = await Group.find({});
        const expenses = await Expense.find({ groupId: group._id });

        res.status(200).json({
            group: group,
        })
    } catch (err) {
        console.error("Error fetching group:", err);
        res.status(500).send("Server error");
    }
};

export const getGroupById = async (req, res) => {
    try{
        const { id } = req.params;
        const group = await Group.findById({_id: id});
        const expenses = await Expense.find({ groupId: group._id });

        const { balances, settlements } = calculateFinances(expenses, group.members);
        res.status(200).json({
            group: group,
            expenses: expenses,
            balances: balances,
            settlements: settlements
        })
    }catch(err){
        console.log('Error fetching group', err);
        res.status(500).json({message: "error fetching group"});
    }
}

export const createGroups = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const members = req.body['members[]'];

        if (!groupName || !members || members.length === 0) {
            return res.status(400).send("Group name and members are required.");
        }

        const group = new Group({
            groupName,
            members: members, 
        });

        await group.save(); 

        res.status(200).json({
            message: "Group successfully created",
            group: group
        })
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).send("Server Error");
    }
};

export const deleteGroup = async(req,res) => {
    try{
        const { id } = req.params
        const group = await Group.findByIdAndDelete(id);
        if (!group) {
            return res.status(404).send("Group not found");
        }
        res.status(200).json({
            message: "Group successfully deleted"
        })
    }catch(err){
        console.error("Error fetching group:", err);
        res.status(500).send("Server error");
    }
}