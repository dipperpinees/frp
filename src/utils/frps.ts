import path from 'path';
import FRP from './frp';

export default class FRPS extends FRP {
    constructor() {
        super(
            path.join(__dirname, `../../bin/frp/frps.ini`),
            path.join(__dirname, `../../bin/frp/frps${process.platform === 'win32' ? '.exe' : ''}`)
        );
    }
}
