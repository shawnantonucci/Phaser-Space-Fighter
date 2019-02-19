class SceneMain extends Phaser.Scene {
    constructor() {
        super('SceneMain');
    }
    preload()
    {
        //load our images or sounds

    }
    create() {
        //define our objects
            //set up
        emitter = new Phaser.Events.EventEmitter();
        controller = new Controller();

        let mediaManager = new MediaManager({ scene: this});

        let sb = new SoundButtons({scene :this});

    }

    update() {
        //constant running loop

    }
}