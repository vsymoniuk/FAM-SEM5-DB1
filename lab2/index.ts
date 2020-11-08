import { config as configEnv } from 'dotenv';
import { Controller } from '@controller';


(async () => {
    configEnv();
    
    const controller = new Controller();
    return controller.init();
})();