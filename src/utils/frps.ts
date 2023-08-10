import FRP from './frp';

export default class FRPS extends FRP {
    constructor() {
        super(
            "frps.ini",
            `frps${process.platform === 'win32' ? '.exe' : ''}`
        );
    }
}
