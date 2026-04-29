"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const distributeTasks = (tasks, agents) => {
    if (!agents.length)
        return [];
    const totalTasks = tasks.length;
    const totalAgents = agents.length;
    const baseTasks = Math.floor(totalTasks / totalAgents);
    const remainingTasks = totalTasks % totalAgents;
    const result = [];
    let taskIndex = 0;
    // equal distribution
    for (let i = 0; i < totalAgents; i++) {
        for (let j = 0; j < baseTasks; j++) {
            result.push({
                ...tasks[taskIndex],
                agent: agents[i]._id,
            });
            taskIndex++;
        }
    }
    // remaining tasks
    for (let i = 0; i < remainingTasks; i++) {
        result.push({
            ...tasks[taskIndex],
            agent: agents[i]._id,
        });
        taskIndex++;
    }
    return result;
};
exports.default = distributeTasks;
