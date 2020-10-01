import {getInstance} from "../instance";
import {Filter} from "./Filter";

export class DelayFilter extends Filter {

    private _delayTime: number;
    private _feedbackAmt: number;
    private _delay: DelayNode;
    private _feedback: GainNode;
    private _outGain: GainNode;

    constructor(delayTime: number = 0.5, feedbackAmt: number = 0.5) {
        if (getInstance().useLegacy) {
            super(null);
            return;
        }

        const audioContext: AudioContext = getInstance().context.audioContext;
        const delay: DelayNode = audioContext.createDelay(delayTime);
        const feedback: GainNode = audioContext.createGain();
        const outGain: GainNode = audioContext.createGain();

        feedback.gain.value = feedbackAmt;
        outGain.gain.value = 1.0;

        this._delay = delay;
        this._feedback = feedback;
        this._outGain = outGain;

        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(outGain);
        this.source.connect(outGain); // This connects the input source.

        super(delay, outGain);
    }

    set delayTime(value: number) {
        this._delayTime = value;
        this._delay.delayTime.value = value;
    }

    get delayTime(): number {
        return this._delayTime;
    }

    set feedbackAmt(value: number) {
        this.feedbackAmt = value;
        this._feedback.gain.value = value;
    }

    get feedbackAmt(): number {
        return this._feedbackAmt;
    }

    public destroy(): void {
        super.destroy();
        this._delay = null;
        this._feedback = null;
        this._outGain = null;
    }
}
