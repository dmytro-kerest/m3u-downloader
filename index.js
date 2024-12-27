
import fs from "node:fs";
import https from "node:https";
import parsers from "playlist-parser";
import progress from "progress-bar-cli";

console.log('Starting Downloader.');

const path = '/Users/dima/Downloads/5.m3u';
const M3U = parsers.M3U;
const playlist = M3U.parse(fs.readFileSync(path, { encoding: "utf8" }));

const timer = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
}

var i = 0;
var total_chunks = playlist.length;
let startTime = new Date();

const downloadFile = async (url, fileFullPath) =>{
    return new Promise((resolve, reject) => {
        https.get(url, { timeout: 60000 },(resp) => {

            // chunk received from the server
            resp.on('data', (chunk) => {
                fs.appendFileSync(fileFullPath, chunk);
            });

            // last chunk received, we are done
            resp.on('end', () => {
                resolve('File downloaded and stored at: '+ fileFullPath);
            });


        }).on("error", (err) => {
            reject(new Error(err.message))
        });
    })
}

await playlist.reduce(async (a, item) => {
    // Wait for the previous item to finish processing
    await a;
    // Process this item
    if(item != undefined) {
        await timer(1500);
        await downloadFile(item.file, '5.mp4');
        i++;
        progress.progressBar(i, total_chunks, startTime);
    }

}, Promise.resolve());

progress.progressBar(i, total_chunks, startTime);
