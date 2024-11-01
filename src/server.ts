import app from './app';
import mongoose from 'mongoose';
import config from './app/config';
import { Server } from 'http';
import seedSuperAdmin from './app/db';

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        // seed super admin, if there is none
        await seedSuperAdmin();
        
        server = app.listen(config.port, () => {
            console.log(`app listening on port ${config.port}`);
        });
    } catch (err) {
        console.log(err);
    }
}

// handle unhandledRejection
process.on('unhandledRejection', (reason, promise) => {
    console.error('unhandledRejection:', { reason }, { promise });
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
process.on('uncaughtException', (error) => {
    console.log('uncaughtException:', { error });
    process.exit(1);
});

main();
