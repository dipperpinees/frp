import path from 'path';
import FRP from './frp';

export default class FRPC extends FRP {
    constructor() {
        super(
            path.join(__dirname, `../../bin/frp/frpc.ini`),
            path.join(__dirname, `../../bin/frp/frpc${process.platform === 'win32' ? '.exe' : ''}`)
        );
    }
}
