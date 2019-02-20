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
    this.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );

    this.background.setInteractive();
    this.background.on("pointerup", this.backgroundClicked, this);
    this.background.on("pointerdown", this.onDown, this);

    this.cameras.main.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.cameras.main.startFollow(this.ship, true);

    this.bulletGroup = this.physics.add.group();

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

        Align.scaleToGameW(child, 0.1);

        let vx = Math.floor(Math.random() * 2) - 1;
        let vy = Math.floor(Math.random() * 2) - 1;
        if (vx == 0 && vy == 0) {
          vx = 1;
          vy = 1;
        }

        let speed = Math.floor(Math.random() * 200) + 10;
        child.body.setVelocity(vx * speed, vy * speed);
      }.bind(this)
    );

    this.physics.add.collider(this.rockGroup);
    this.physics.add.collider(this.bulletGroup, this.rockGroup, this.destroyRock, null, this);

    let frameNames = this.anims.generateFrameNumbers('exp');

    let f2 = frameNames.slice();
    f2.reverse();

    let f3 = f2.concat(frameNames);

    this.anims.create({
        key: 'boom',
        frames: f3,
        frameRate: 48,
        repeat: false
    });

    this.eship = this.physics.add.sprite(this.centerX, 0, "eship");
    Align.scaleToGameW(this.eship, 0.25);

    this.makeInfo();
  }

  makeInfo()
  {
    this.text1 = this.add.text(0,0,"Shields\n100", {fontSize:game.config.width/30, align: "center", backgroundColor: '#000000'});
    this.text2 = this.add.text(0,0,"Enemy Shields\n100", {fontSize:game.config.width/30, align: "center", backgroundColor: '#000000'});

    this.text1.setOrigin(0.5,0.5);
    this.text2.setOrigin(0.5,0.5);
    
    this.uiGrid = new AlignGrid({scene:this,rows:11,cols:11});
    // this.uiGrid.showNumber();
    //
    //
    this.uiGrid.placeAtIndex(2, this.text1);
    this.uiGrid.placeAtIndex(9, this.text2);
    //
    //
    this.icon1 = this.add.image(0,0,"ship");
    this.icon2 = this.add.image(0,0,"eship");
    Align.scaleToGameW(this.icon1, .05);
    Align.scaleToGameW(this.icon2, .05);

    this.uiGrid.placeAtIndex(1, this.icon1);
    this.uiGrid.placeAtIndex(7, this.icon2);

    this.icon1.angle = 270;
    this.icon2.angle = 270;

    this.text1.setScrollFactor(0);
    this.text2.setScrollFactor(0);
    this.icon1.setScrollFactor(0);
    this.icon2.setScrollFactor(0);
  }

  destroyRock(bullet, rock)
  {
    bullet.destroy();
    let explosion = this.add.sprite(rock.x, rock.y, 'exp');
    explosion.play('boom');
    rock.destroy();
  }

  getTimer() {
    let d = new Date();
    return d.getTime();
  }

  onDown() {
    this.downTime = this.getTimer();
  }

  backgroundClicked() {
    let elapsed = Math.abs(this.downTime - this.getTimer());

    console.log(elapsed);

    if (elapsed < 300) {
      let tx = this.background.input.localX * this.background.scaleX;
      let ty = this.background.input.localY * this.background.scaleY;
      this.tx = tx;
      this.ty = ty;

      let angle = this.physics.moveTo(this.ship, tx, ty, 100);
      angle = this.toDegrees(angle);
      this.ship.angle = angle;
    } else {
      this.makeBullet();
    }

    let angle2 = this.physics.moveTo(this.eship, this.ship.x, this.ship.y, 60);
    angle2 = this.toDegrees(angle2);
    this.eship.angle = angle2;
  }

  makeBullet() {
    let dirObj = this.getDirFromAngle(this.ship.angle);
    let bullet = this.physics.add.sprite(this.ship.x + dirObj.tx * 30, this.ship.y + dirObj.ty * 30, "bullet");
    this.bulletGroup.add(bullet);
    bullet.angle = this.ship.angle;
    bullet.body.setVelocity(dirObj.tx * 200, dirObj.ty * 200);
  }

  fireEBullet()
  {
    let elapsed = Math.abs(this.lastEBullet - this.getTimer());
    if (elapsed < 500)
    {
      return;
    }
    this.lastEBullet = this.getTimer();

    let ebullet = this.physics.add.sprite(this.eship.x, this.eship.y, "ebullet");
    ebullet.body.angularVelocity = 10;
    this.physics.moveTo(ebullet, this.ship.x, this.ship.y, 100);
  }

  getDirFromAngle(angle) {
    var rads = (angle * Math.PI) / 180;
    var tx = Math.cos(rads);
    var ty = Math.sin(rads);
    return { tx, ty };
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

    let distX2 = Math.abs(this.ship.x - this.eship.x);
    let distY2 = Math.abs(this.ship.y - this.eship.y);
    if (distX2 < game.config.width / 5 && distY2 < game.config.height / 5) {
      this.eship.alpha = .5;
      this.fireEBullet();
    }
  }
}
