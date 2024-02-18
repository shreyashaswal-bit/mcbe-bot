class Vec3 {
    x = 0;
    y = 0;
    z = 0;
    constructor(x = 0, y = 0, z = 0) {
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
    }
}

class BlockPosition extends Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z);
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
    }
}

module.exports = { Vec3, BlockPosition };
