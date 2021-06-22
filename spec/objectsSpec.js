/*
 * GameObject tests
 */
describe("GameObject", function() {
  class TestGameObject extends GameObject {
    constructor(game, box) {super(game, box);}
  }

  let object;
  beforeEach(function() {
    object = new TestGameObject(null, new BoundingBox(1,1,10,10));
  });

  it("can't be created", function() {
    expect(() => new GameObject()).toThrowError(
      TypeError, 'Abstract class "GameObject" cannot be instantiated directly');
  });

  describe("draw", function() {
    it("enforces draw method definition", function() {
      expect(() => object.draw(null)).toThrowError(TypeError);
    });
  });

  describe("collision", function() {
    it("detects collision", function() {
      let object2 = new TestGameObject(null, new BoundingBox(5,5,10,10));
      expect(object.collision(object2)).toBeTrue();
    });
    it("detects not collision", function() {
      let object2 = new TestGameObject(null, new BoundingBox(11,11,10,10));
      expect(object.collision(object2)).toBeFalse();
    });
  });

  describe("intersects", function() {
    it("detects intersection", function() {
      let object2 = new TestGameObject(null, new BoundingBox(5,5,10,10));
      expect(object.intersects(object2)).toBeTruthy();
    });
    it("detects non-intersection", function() {
      let object2 = new TestGameObject(null, new BoundingBox(12,12,10,10));
      expect(object.intersects(object2)).toBeFalsy();
    });
    it("detects axis of intersection", function() {
      let object2 = new TestGameObject(null, new BoundingBox(9,8,10,10));
      expect(object.intersects(object2)).toEqual({side: 'x', pos: 12});
    });
  });
});

/*
 * Block tests
 */
describe("Block", function() {
  let mockContext;
  let block;
  beforeEach(function() {
    mockContext = jasmine.createSpyObj("context", ["beginPath", "rect", "fill", "arc"]);
    block = new Block(null, new BoundingBox(1,1,100,50));
  });

  it("is created with correct values", function() {
    expect(block._alive).toBeTrue();
  });

  describe("Accessors", function() {
    it("can get alive state", function() {
      expect(block.isAlive).toBeTrue();
    });
    it("can not set alive state", function() {
      block.isAlive = false;
      expect(block.isAlive).toBeTrue();
    });
  });

  describe("draw", function() {
    it("can be called", function() {
      expect(() => block.draw(mockContext)).not.toThrow();
    });
    it("does nothing if dead", function() {
      expect(mockContext.fill).not.toHaveBeenCalled();
    });
  });

  describe("Collision", function() {
    it("detects collision", function() {
      block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(block.collision(block2)).toBeTrue();
    });
    it("detects non-collision", function() {
      block2 = new Block(null, new BoundingBox(102,150,100,50));
      expect(block.collision(block2)).toBeFalse();
    });
    it("dies on collision", function() {
      block2 = new Block(null, new BoundingBox(5,5,100,50));
      block.collision(block2);
      expect(block._alive).toBeFalse();
    });
    it("does nothing if dead", function() {
      spyOn(GameObject.prototype, 'collision');
      block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(GameObject.prototype.collision).not.toHaveBeenCalled();
    });
  });

  describe("Intersection", function() {
    it("detects intersection", function() {
      block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(block.intersects(block2)).toBeTruthy();
    });
    it("detects non-intersection", function() {
      block2 = new Block(null, new BoundingBox(102,150,100,50));
      expect(block.intersects(block2)).toBeFalsy();
    });
    it("detects axis of intersection", function() {
      block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(block.intersects(block2)).toEqual({side: "y", pos: 52})
    });
    it("dies on intersection", function() {
      block2 = new Block(null, new BoundingBox(5,5,100,50));
      block.intersects(block2);
      expect(block._alive).toBeFalse();
    });
    it("does nothing if dead", function() {
      spyOn(GameObject.prototype, 'intersects');
      block2 = new Block(null, new BoundingBox(5,5,100,50));
      expect(GameObject.prototype.intersects).not.toHaveBeenCalled();
    });
  });
});