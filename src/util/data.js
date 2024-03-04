class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class BlockPosition extends Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        super(Math.floor(x), Math.floor(y), Math.floor(z));
    }
}

module.exports = { Vec3, BlockPosition };
