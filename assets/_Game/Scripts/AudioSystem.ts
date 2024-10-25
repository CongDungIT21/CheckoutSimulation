import { _decorator, AudioClip, AudioSource, Component, director, find, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioSystem')
export class AudioSystem extends Component {
    private static _instance: AudioSystem | null = null;

    public static get instance(): AudioSystem {
        if (!this._instance) {
            this._instance = find(this.name)?.getComponent(AudioSystem);

            if (!this._instance) {
                let generatorNode: Node = new Node(this.name);
                this._instance = generatorNode.addComponent(AudioSystem);

                director.getScene().addChild(generatorNode);
                console.log("Auto create " + this.name);
            }
        }
        return this._instance;
    }

    @property(AudioSource)
    private musicSource: AudioSource = null;
    @property(AudioSource)
    private soundsSource: AudioSource = null;
    @property(AudioClip)
    private musicClip: AudioClip = null;
    @property(AudioClip)
    private correctClip: AudioClip = null;
    @property(AudioClip)
    private inCorrectClip: AudioClip = null;

    private _canAudio: boolean = false;
    public set CanAudio(value: boolean) {
        this._canAudio = value;
        this.CanMusic = value;
        this.CanSound = value;
    }
    public get CanAudio(): boolean {
        return this._canAudio;
    }

    private _canMusic: boolean = false;
    public set CanMusic(value: boolean) {
        this._canMusic = value;
        if (this._canMusic) {
            this.playMusic();
        } else {
            this.stopMusic();
        }
    }
    public get CanMusic(): boolean {
        return this._canMusic;
    }

    private _canSound: boolean = false;
    public set CanSound(value: boolean) {
        this._canSound = value;
    }
    public get CanSound(): boolean {
        return this._canSound;
    }

    protected onLoad(): void {
        AudioSystem._instance = this;
    }

    protected start(): void {
        this.CanAudio = true;
    }

    public playMusic(clip: AudioClip = null): void {
        if (clip) {
            this.musicSource.clip = clip;
        } else if (this.musicClip) {
            this.musicSource.clip = this.musicClip;
        } else {
            return;
        }

        this.musicSource.loop = true;

        if (this.musicSource.clip && !this.musicSource.playing) {
            this.musicSource.play();
        }
    }

    public stopMusic(): void {
        this.musicSource.stop();
    }

    public playInCorrectSound()
    {
        if (!this.CanSound) {
            this.stopSound();
            return;
        }
        
        this.soundsSource.playOneShot(this.inCorrectClip);
    }

    public playCorrectSound()
    {
        if (!this.CanSound) {
            this.stopSound();
            return;
        }

        this.soundsSource.playOneShot(this.correctClip);        
    }

    public playSound(clip: AudioClip, pos: Vec3 = new Vec3(0, 0, 0), vol: number = 1): void {
        if (!this.CanSound) {
            this.stopSound();
            return;
        }

        this.soundsSource.node.setPosition(pos);
        this.playSoundClip(clip, vol);
    }

    private playSoundClip(clip: AudioClip, vol: number = 1, loop: boolean = false): void {
        if (!this.CanSound) {
            this.stopSound();
            return;
        }

        this.soundsSource.clip = clip;
        this.soundsSource.volume = vol;
        this.soundsSource.loop = loop;
        this.soundsSource.play();
    }

    public stopSound(): void {
        this.soundsSource.stop();
    }
}


