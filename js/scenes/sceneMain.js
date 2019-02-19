class SceneMain extends Phaser.Scene {
  constructor() {
    super("SceneMain");
  }
  preload() {
    //load our images or sounds
  }
  create() {
    //define our objects
    //set up
    emitter = new Phaser.Events.EventEmitter();
    controller = new Controller();

    let mediaManager = new MediaManager({ scene: this });

    let sb = new SoundButtons({ scene: this });

    this.centerX = game.config.width / 2;
    this.centerY = game.config.height / 2;

    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);
    this.ship = this.physics.add.sprite(this.centerX, this.centerY, "ship");
    Align.scaleToGameW(this.ship, 0.125);

    this.background.scaleX = this.ship.scaleX;
    this.background.scaleY = this.ship.scaleY;

    this.background.setInteractive();
    this.background.on("pointerdown", this.backgroundClicked, this);

    this.cameras.main.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.cameras.main.startFollow(this.ship, true);

    this.rockGroup = this.physics.add.group({
      key: "rocks",
      frame: [0, 1, 2],
      frameQuantity: 4,
      bounceX: 1,
      bounceY: 1,
      angularVelocity: 1,
      collideWorldBounds: true
    });
    this.rockGroup.children.iterate(
      function(child) {
        let xx = Math.floor(Math.random() * this.background.displayWidth);
        let yy = Math.floor(Math.random() * this.background.displayHeight);
        child.x = xx;
        child.y = yy;

        Align.scaleToGameW(child, .1);
      }.bind(this)
    );
  }

  backgroundClicked() {
    let tx = this.background.input.localX * this.background.scaleX;
    let ty = this.background.input.localY * this.background.scaleY;
    this.tx = tx;
    this.ty = ty;

    let angle = this.physics.moveTo(this.ship, tx, ty, 60);
    angle = this.toDegrees(angle);
    this.ship.angle = angle;
  }

  toDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  update() {
    //constant running loop
    let distX = Math.abs(this.ship.x - this.tx);
    let distY = Math.abs(this.ship.y - this.ty);
    if (distX < 10 && distY < 10) {
      this.ship.body.setVelocity(0, 0);
    }
  }
}
