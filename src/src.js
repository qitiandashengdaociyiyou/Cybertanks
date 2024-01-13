var me, meter = 10;
function init() {
    me = tanks[0];
    me.health = 1 / 0;
    [
        SHOOT_DELAY,
        BULLET_SPEED,
        TANK_FORWARD_SPEED,
        TANK_REVERSE_SPEED,
        BULLET_LIFE
    ] = [-1, 120, 80, 80, 999];
    gCamera.bounds = {
        min: [0, 0, 0],
        max: [0, 0, 0],
    };
}
function implode(me) {
    var rot = me.rot;
    for (var i = 0; i <= 360; i++) {
        me.rot = rot + i * Math.PI / 180;
        entities.push(createBullet(me, 0));
    }
}
function teleport(me, dist) {
    var [x, y, z] = me.pos;
    x -= Math.cos(me.rot) * dist;
    z += Math.sin(me.rot) * dist;
    me.pos = [x, y, z];
}
function togglePlane(me) {
    if (me.hasBeenPlane)
        me.isPlane = !me.isPlane;
    else
        makePlane(me);
}
function dialGrav(event) {
    GRAVITY += event.deltaY * .01;
}
var shadowFury = {
    findTargets(me) {
        var [x, y, z] = me.pos;
        var targets = tanks.filter(function (tank) {
            if (tank === me || !tank.pos)
                return false;
            var [tx, ty, tz] = tank.pos;
            return Math.sqrt((tx - x) * (tx - x) + (tz - z) * (tz - z) + (ty - y)) < 12 * meter;
        });
        targets.splice(5);
        return targets;
    },
    next(me) {
        if (this.targets.length < 1)
            this.targets = this.findTargets(me);
        teleportNext(me, this.targets.pop());
        teleport(me, -BULLET_SPEED);
    },
    targets: [],
}
function teleportNext(me, target) {
    me.pos = target.pos;
    me.rot = target.rot;
}
function main() {
    init();
    addEventListener("wheel", dialGrav);
    addEventListener("keydown", function (event) {
        switch (event.code) {
            case "ControlLeft":
            case "ControlRight":
                if (event.repeat)
                    return;
                togglePlane(me);
                break;
            case "Tab":
                if (event.repeat)
                    return;
                shadowFury.next(me);
                break;
            case "Space":
                if (!event.shiftKey) {
                    if (event.repeat)
                        return;
                    else
                        event.stopImmediatePropagation();
                    teleport(me, meter);
                }
                implode(me);
        }
    }, true);
}
main();