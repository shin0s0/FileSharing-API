import cron from "node-cron";
import shell from "shelljs";


export const scheduleTask = () =>{
    const task = cron.schedule("* * * * * *", () => {
        const scriptPath = "./scheduler/delete.js"; 
        const result = shell.exec(`node ${scriptPath}`);

        if (result.code !== 0) {
            console.error(`Script execution failed with code ${result.code}`);
        } else {
            console.log(`Script executed successfully`);
        }
    });
    task.start();
}