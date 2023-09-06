import cron from "node-cron";
import {spawn} from "child_process";

export const scheduleTask = () =>{
    const task = cron.schedule("0 0 * * *", () => {
        const scriptPath = "./scheduler/delete.js"; 
        const childProcess = spawn("node", [scriptPath]);

        childProcess.stdout.on("data", (data) => {
            console.log(`Script output: ${data}`);
        });

        childProcess.stderr.on("data", (error) => {
            console.error(`Script error: ${error}`);
        });

        childProcess.on("close", (code) => {
            if (code === 0) {
                console.log("Script executed successfully.");
            } else {
                console.error(`Script exited with code ${code}`);
            }
        });
    });
    task.start();
}