const assert = require("assert");
const R = require("ramda");
const robotPositions = require("./robot-positions");

const inputStr = `5 3\n1 1 E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\nLLFFFLFLFL`;

// PARSE INPUT STRING

assert(
  R.equals(robotPositions.parseInputStr(inputStr), [
    5,
    3,
    [
      [[1, 1], "E", ["R", "F", "R", "F", "R", "F", "R", "F"]],
      [
        [3, 2],
        "N",
        ["F", "R", "R", "F", "L", "L", "F", "F", "R", "R", "F", "L", "L"]
      ],
      [[0, 3], "W", ["L", "L", "F", "F", "F", "L", "F", "L", "F", "L"]]
    ]
  ])
);

/// CALCULATE NEW ORIENTATION

assert(robotPositions.calculateNewOrientation("N", "R") === "E");
assert(robotPositions.calculateNewOrientation("E", "R") === "S");
assert(robotPositions.calculateNewOrientation("S", "R") === "W");
assert(robotPositions.calculateNewOrientation("W", "R") === "N");

assert(robotPositions.calculateNewOrientation("N", "L") === "W");
assert(robotPositions.calculateNewOrientation("E", "L") === "N");
assert(robotPositions.calculateNewOrientation("S", "L") === "E");
assert(robotPositions.calculateNewOrientation("W", "L") === "S");

assert(robotPositions.calculateNewOrientation("N", "F") === "N");
assert(robotPositions.calculateNewOrientation("E", "F") === "E");
assert(robotPositions.calculateNewOrientation("S", "F") === "S");
assert(robotPositions.calculateNewOrientation("W", "F") === "W");

/// CALCULATE NEW POSITION

assert(R.equals(robotPositions.calculateNewPosition([0, 1], "N", "F"), [0, 2]));
assert(R.equals(robotPositions.calculateNewPosition([0, 1], "S", "F"), [0, 0]));
assert(R.equals(robotPositions.calculateNewPosition([0, 1], "E", "F"), [1, 1]));
assert(R.equals(robotPositions.calculateNewPosition([1, 0], "W", "F"), [0, 0]));

// CALCULATE FINAL POSITION

assert(
  R.equals(
    robotPositions.calculateFinalPosition(
      5,
      3,
      [3, 2],
      "N",
      ["F", "R", "R", "F", "L", "L", "F", "F", "R", "R", "F", "L", "L"],
      []
    ),
    {
      coords: [3, 3],
      orientation: "N",
      lost: true,
      newlyScentedSquares: [[3, 3]]
    }
  )
);

assert(
  R.equals(
    robotPositions.calculateFinalPosition(
      5,
      3,
      [1, 1],
      "E",
      ["R", "F", "R", "F", "R", "F", "R", "F"],
      []
    ),
    { coords: [1, 1], orientation: "E", lost: false, newlyScentedSquares: [] }
  )
);

assert(
  R.equals(
    robotPositions.calculateFinalPosition(
      5,
      3,
      [0, 3],
      "W",
      ["L", "L", "F", "F", "F", "L", "F", "L", "F", "L"],
      [[3, 3]]
    ),
    { coords: [2, 3], orientation: "S", lost: false, newlyScentedSquares: [] }
  )
);

/// CALCULATE FINAL POSITIONS

assert(
  R.equals(
    robotPositions.calculateFinalPositions([
      5,
      3,
      [
        [[1, 1], "E", ["R", "F", "R", "F", "R", "F", "R", "F"]],
        [
          [3, 2],
          "N",
          ["F", "R", "R", "F", "L", "L", "F", "F", "R", "R", "F", "L", "L"]
        ],
        [[0, 3], "W", ["L", "L", "F", "F", "F", "L", "F", "L", "F", "L"]]
      ]
    ]),
    [
      {
        coords: [1, 1],
        newlyScentedSquares: [],
        orientation: "E",
        lost: false
      },
      {
        coords: [3, 3],
        newlyScentedSquares: [[3, 3]],
        orientation: "N",
        lost: true
      },
      {
        coords: [2, 3],
        newlyScentedSquares: [],
        orientation: "S",
        lost: false
      }
    ]
  )
);

// FINAL POSITIONS TO STRING

assert(
  robotPositions.finalPositionsToStr([
    {
      coords: [1, 1],
      newlyScentedSquares: [],
      orientation: "E",
      lost: false
    },
    {
      coords: [3, 3],
      newlyScentedSquares: [[3, 3]],
      orientation: "N",
      lost: true
    },
    {
      coords: [2, 3],
      newlyScentedSquares: [],
      orientation: "S",
      lost: false
    }
  ]) === "1 1 E\n3 3 N LOST\n2 3 S"
);

// REPORT FINAL POSITIONS

assert(
  robotPositions.reportFinalPositions(inputStr) === "1 1 E\n3 3 N LOST\n2 3 S"
);
