class Vec3 {
    x = 0
    y = 0
    z = 0
    constructor(x = 0, y = 0, z = 0) {
        this.x = Number(x)
        this.y = Number(y)
        this.z = Number(z)
    }
}

class BlockPosition extends Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z)
        this.x = parseInt(Number(this.x))
        this.y = parseInt(Number(this.y))
        this.z = parseInt(Number(this.z))
    }
}

module.exports = { Vec3, BlockPosition }