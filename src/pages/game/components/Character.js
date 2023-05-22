import Phaser from "phaser";
import { BOSS, ZEPHYR, FIRE, STATE_SLIDING, BEAR, PLAYER, SKEL1, SKEL2, STATE_ATTACKING_MAGIC, STATE_ATTACKING_SPECIAL, BOSS2 } from "../playerConfig";
import { } from "../playerConfig";
import { STATE_ATTACKING, STATE_IDLING, STATE_WALKING, STATE_DYING, STATE_WAITING, STATE_HURTING, STATE_KICKING, STATE_RUNNING, STATE_SLASHING_IDLE, STATE_SLASHING_RUNNING, STATE_ATTACKING_SIDE } from '../playerConfig';
import { LEFT, RIGHT, UP, DOWN } from '../playerConfig';

class Character {

    constructor(scene, config) {
        this.scene = scene;

        this.config = { ...config };

        this.dead = false;


        this.shadow = this.scene.add.ellipse(config.x + config.shadow_x, config.y + config.shadow_y, config.shadow_width, config.shadow_height, "#000000", 0.7).setOrigin(0, 0).setScale(config.scale, config.scale);

        this.body = this.scene.physics.add.sprite(config.x, config.y, config.type, 0).setScale(config.scale, config.scale).setOrigin(0, 0);
        this.laser = this.scene.physics.add.sprite(config.x, config.y, "laser", "GorillaBoss0065").setOrigin(0, 0);
        this.laser.setBodySize(400, 75, false);
        this.laser.body.setOffset(0, 25);
        // this.laser.play("laser");
        if (config.type != BOSS2) {
            this.laser.setAlpha(0);
        }
        // if (this.config.type == SKEL1 || this.config.type == SKEL2)
        //     this.body.setOrigin(0.5, 0.5);

        this.body.setCollideWorldBounds(true);

        this.body.setBodySize(config.body_width, config.body_height, false);
        this.body.setBodySize(config.body_width, config.body_height, false);
        this.body.body.setOffset(config.offsetX, config.offsetY);
        this.attacking = false;

        //event
        this.body.on("animationcomplete", ({ key }) => {
            console.log('animation', key);
            if (key == this.config.type + "Hurt") {

                if (this.config.currentHp == 0) {
                    this.die();
                }
                else {

                    this.setState(STATE_WAITING);
                }
            }
            else if (key == this.config.type + "Die") {
                this.dead = true;
                this.body.emit("die", { ...this.config });
                if (this.config.type != PLAYER) {
                    this.body.destroy();
                    this.shadow.destroy();
                }

            }
            else if (key == this.config.type + "AttackSpecial") {
                this.setState(STATE_WAITING);
                this.laser.setFrame("GorillaBoss0065");
            }
            else {
                this.setState(STATE_WAITING);
                // this.body.setOrigin(0, 0);
            }

            if (this.magicInterval != undefined)
                clearInterval(this.magicInterval);

        })




    }
    setPosition = (x, y) => {
        this.shadow.setPosition(x + this.config.shadow_x, this.config.y + this.config.shadow_y);
        this.laser.setPosition(x + 100, y);
        this.body.setPosition(x, y)
    }
    setState = (state) => {
        this.config.state = state;
    }
    setVelocity = (x = 0, y = 0) => {
        this.body.setVelocity(x, y);
    }

    slideMove = () => {
        let d = this.config.direction;
        if (this.body.flipX == true) {
            if (d == LEFT) d = RIGHT;
            else d = LEFT;
        }
        this.movePosition(d, null, 12);
    }

    movePosition = (directionH, directionV, rate = 1) => {
        this.setVelocity(0, 0);
        let s = rate * this.config.speed
        if (directionV != null) {
            if (directionV == UP) {
                this.body.setVelocityY(-s);
            }


            else if (directionV == DOWN) {
                this.body.setVelocityY(s);
            }
        }
        if (directionH != null) {

            if (directionH != this.config.direction) {
                this.body.setFlipX(true);
                this.laser.setFlipX(true);

            }
            else {
                this.body.setFlipX(false);
                this.laser.setFlipX(false);
            }

            if (directionH == LEFT) this.body.setVelocityX(-s);
            if (directionH == RIGHT) this.body.setVelocityX(s);
        }
    }
    stopAll = () => {
        this.setState(STATE_WAITING);
        clearInterval(this.magicInterval);
    }

    /// animations
    idle = () => {
        console.log(this.config.type);
        this.body.play(this.config.type + "Idle")
        this.body.setVelocity(0);
        this.setState(STATE_IDLING);
    }
    slide = () => {
        this.body.play(this.config.type + "Slide")
        this.body.setVelocity(0);
        // this.body.setOrigin(1, 0.5);
        this.setState(STATE_SLIDING)
        this.slideMove();
    }
    hurt = () => {
        this.body.play(this.config.type + "Hurt")
        this.body.setVelocity(0);
        this.setState(STATE_HURTING)
    }
    jump = () => {

    }

    die = () => {
        this.body.play(this.config.type + "Die")
        this.body.setVelocity(0);
        this.setState(STATE_DYING);
    }

    walk = () => {
        this.body.play(this.config.type + "Walk");
        this.setState(STATE_WALKING);
    }
    run = () => {
        this.body.play(this.config.type + "Run");
        this.setState(STATE_RUNNING);
    }

    kick = () => {
        this.body.play(this.config.type + "Kick");
        this.setVelocity(0, 0);
        this.setState(STATE_KICKING);
    }
    slashIdle = () => {
        this.body.play(this.config.type + "Slash");
        this.setVelocity(0, 0);

        // this.setAttackFlag(3, 6);
        this.emitAttack(3);
        this.setState(STATE_SLASHING_IDLE);
    }

    slashRun = () => {
        this.body.play(this.config.type + "RunSlash");

        // this.setAttackFlag(3, 6);
        this.emitAttack(3);
        this.setState(STATE_SLASHING_RUNNING);
    }

    // =======
    setAttackFlag = (st, en) => {
        setTimeout(() => {
            this.attacking = true;
        }, st * 1000 / 24);
        setTimeout(() => {
            this.attacking = false;
        }, en * 1000 / 24);
    }

    // ======= 
    reduceHp = (hp) => {
        this.config.hp -= hp;
        if (this.config.hp == 0) {
            this.emit("dead");
        }

    }
    //======================================================================
    attack = () => {
        //13~18
        this.body.play(this.config.type + "Attack");
        this.setVelocity(0, 0);
        // this.setAttackFlag(14, 18);
        this.emitAttack(14);
        this.setState(STATE_ATTACKING);
    }

    attackSide = () => {
        //13~18
        this.body.play(this.config.type + "AttackSide");
        this.setVelocity(0, 0);
        // this.setAttackFlag(14, 18);
        this.emitAttackSide(14);
        this.setState(STATE_ATTACKING_SIDE);
    }

    attackSpecial = () => {
        this.body.play(this.config.type + "AttackSpecial");
        this.setVelocity(0, 0);
        // this.setAttackFlag(14, 18);
        this.laser.play('laser');
        this.emitAttackSpecial(5);
        this.setState(STATE_ATTACKING_SPECIAL);
    }

    magicAttack = () => {
        this.body.play(this.config.type + "AttackMagic");
        this.setVelocity(0, 0);
        this.setState(STATE_ATTACKING_MAGIC);
        this.emitAttackMagic(28);
    }
    emitAttackSpecial = (st) => {
        setTimeout(() => {
            if (this.config.state == STATE_ATTACKING_SPECIAL)

                this.magicInterval = setInterval(() => {
                    this.body.emit("attackSpecial", {
                        x: this.laser.x,
                        y: this.laser.y,
                        range: this.config.range,
                        direction: this.direction(),
                    });
                }, 100);
        }, st * 1000 / 24)
    }
    emitAttackMagic = (st) => {
        setTimeout(() => {
            if (this.config.state == STATE_ATTACKING_MAGIC)

                this.magicInterval = setInterval(() => {
                    this.body.emit("attackMagic", {
                        x: this.x(),
                        y: this.y(),
                        range: this.config.range,
                        direction: this.direction(),
                    });
                }, 100);
        }, st * 1000 / 24)
    }

    emitAttackSide = (st) => {
        setTimeout(() => {
            if (this.config.state == STATE_ATTACKING || this.config.state == STATE_ATTACKING_SIDE || this.config.state == STATE_SLASHING_IDLE || this.config.state == STATE_SLASHING_RUNNING)
                this.body.emit("attackSide", {
                    x: this.x(),
                    y: this.y(),
                    range: this.config.range,
                    direction: this.direction(),
                });
        }, st * 1000 / 24)
    }

    emitAttack = (st) => {
        setTimeout(() => {
            if (this.config.state == STATE_ATTACKING || this.config.state == STATE_ATTACKING_SIDE || this.config.state == STATE_SLASHING_IDLE || this.config.state == STATE_SLASHING_RUNNING)
                this.body.emit("attack", {
                    x: this.x(),
                    y: this.y(),
                    range: this.config.range,
                    direction: this.direction(),
                });
        }, st * 1000 / 24)
    }

    updateState = (state, data) => {
        // console.log(this.config.type, state);
        if (this.config.state == STATE_DYING) return;
        switch (state) {

            case STATE_IDLING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING)
                    this.idle();
                break;
            case STATE_WALKING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING)
                    this.walk();
                if (this.config.state == STATE_WALKING) this.movePosition(data.directionH, data.directionV);

                break;
            case STATE_RUNNING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_WALKING)
                    this.run();
                if (this.config.state == STATE_RUNNING) this.movePosition(data.directionH, data.directionV, 2);
                break;
            case STATE_SLASHING_IDLE:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_WALKING)
                    this.slashIdle();
                break;
            case STATE_SLASHING_RUNNING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING) {
                    this.slashRun();
                }
                this.movePosition(data.directionH, data.directionV, 2);
                break;
            case STATE_ATTACKING_SIDE:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING)
                    this.attackSide();
                break;
            case STATE_ATTACKING_MAGIC:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING)
                    this.magicAttack();
                break;
            case STATE_ATTACKING_SPECIAL:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING)
                    this.attackSpecial();
                break;
            case STATE_KICKING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING) {
                    this.kick();
                }
                break;
            case STATE_HURTING:
                if (this.config.state != this.STATE_DYING && this.dead == false) {
                    this.hurt();
                }
                //hurt
                break;
            case STATE_SLIDING:
                if (this.config.state == STATE_IDLING || this.config.state == STATE_RUNNING || this.config.state == STATE_WALKING) {
                    this.slide();
                }
                break;
            case STATE_ATTACKING:
                if (this.config.state == STATE_WAITING || this.config.state == STATE_IDLING || this.config.state == STATE_WALKING)
                    this.attack();
                break;


        }
        this.shadow.setPosition(this.body.x + this.config.shadow_x, this.body.y + this.config.shadow_y);


        if (this.laser.flipX == true)
            this.laser.setPosition(this.body.x, this.body.y);
        else
            this.laser.setPosition(this.body.x - 300, this.body.y);



    }

    setZindex = (index) => {
        this.body.setDepth(index);
        this.shadow.setDepth(index - 1);
        this.laser.setDepth(index);
    }

    x = () => {
        if (this.dead == true) return 0;
        return this.body.body.x + this.body.body.width / 2;
    }
    y = () => {
        if (this.dead == true) return 0;
        return this.body.body.y + this.body.body.height / 2;
    }
    direction = () => {
        if (this.body.flipX == false) return this.config.direction;
        else {
            if (this.config.direction == LEFT) return RIGHT;
            else return LEFT;

        }
    }
}

export default Character;
