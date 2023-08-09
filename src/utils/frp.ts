import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

export interface IConfig {
    [type: string]: {
        [type: string]: string;
    };
}

interface IOptions {
    log: boolean;
    unref: boolean;
}

export default class FRP {
    binTarget: string;
    iniTarget: string;

    constructor(initTarget: string, binTarget: string) {
        this.iniTarget = initTarget;
        this.binTarget = binTarget;
    }

    updateConfig(config: IConfig) {
        const dataConfig = Object.entries(config).reduce((accumulator, [key, value]) => {
            const currentConfig = Object.entries(value).reduce((_accumulator, [_key, _value]) => {
                return (_accumulator += `${_key} = ${_value}\n`);
            }, '');
            return (accumulator += `[${key}]\n${currentConfig}\n`);
        }, '');
        writeFileSync(this.iniTarget, dataConfig, { encoding: 'utf8' });
    }

    public start(config: IConfig, { log = true, unref = false }: IOptions) {
        if (!config['common']) {
            throw new Error('Common config is required');
        }
        this.updateConfig(config);

        const childProcess = spawn(this.binTarget, ['-c', this.iniTarget], { stdio: log ? 'pipe' : 'ignore' });
        if (unref) childProcess.unref();

        childProcess.stdout?.on('data', (data) => {
            console.log(`${data}`);
        });
        
        childProcess.stderr?.on('data', (data) => {
            console.error(`${data}`);
        });
    }
}
