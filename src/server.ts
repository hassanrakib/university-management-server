import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        server = app.listen(config.port, () => {
            console.log(`app listening on port ${config.port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

// handle unhandledRejection
process.on('unhandledRejection', () => {
    console.log('unhandledRejection detected...');
    // if process running in the server
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }

    // else
    process.exit(1);
});

// handle uncaughtException
process.on('uncaughtException', () => {
    console.log('uncaughtException detected...');
    process.exit(1);
});

main();
