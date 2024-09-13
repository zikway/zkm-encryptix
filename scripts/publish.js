const { exec } = require('child_process');

exec('cd dist && yalc publish', (error, stdout, stderr) => {
    if (error) {
        console.log(`Publish Error: ${error}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(stdout);
});