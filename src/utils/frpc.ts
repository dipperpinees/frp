import FRP from './frp';

export default class FRPC extends FRP {
    constructor() {
        super(
            "frpc.ini",
            `frpc${process.platform === 'win32' ? '.exe' : ''}`
        );
    }
}
