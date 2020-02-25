const R = require("ramda");

const movements = {
  N: {
    newOrientation: { R: "E", L: "W", F: "N" },
    forwardPosition: (x, y) => [x, y + 1]
  },
  S: {
    newOrientation: { R: "W", L: "E", F: "S" },
    forwardPosition: (x, y) => [x, y - 1]
  },
  E: {
    newOrientation: { R: "S", L: "N", F: "E" },
    forwardPosition: (x, y) => [x + 1, y]
  },
  W: {
    newOrientation: { R: "N", L: "S", F: "W" },
    forwardPosition: (x, y) => [x - 1, y]
  }
};

const calculateNewOrientation = (currentOrientation, letter) =>
  R.path([currentOrientation, "newOrientation", letter], movements);

const calculateNewPosition = ([x, y], orientation, letter) =>
  letter === "F"
    ? R.path([orientation, "forwardPosition"], movements)(x, y)
    : [x, y];

const calculateFinalPosition = (
  maxX,
  maxY,
  initialCoords,
  initialOrientation,
  instruction,
  scentedSquares
) => {
  return R.reduce(
    ({ coords, orientation, newlyScentedSquares, lost }, instruction) => {
      const newCoords = calculateNewPosition(coords, orientation, instruction);
      const [newX, newY] = newCoords;

      const prohibitedFromMoving = R.any(R.equals(coords), scentedSquares);
      const willFallOff = newX > maxX || newY > maxY || newX < 0 || newY < 0;
      const fallingOff = willFallOff && !prohibitedFromMoving;

      return {
        coords: prohibitedFromMoving && willFallOff ? coords : newCoords,
        newlyScentedSquares:
          !lost && fallingOff ? [coords] : newlyScentedSquares,
        orientation: calculateNewOrientation(orientation, instruction),
        lost: lost || fallingOff
      };
    },
    {
      coords: initialCoords,
      orientation: initialOrientation,
      lost: false,
      newlyScentedSquares: []
    },
    instruction
  );
};

const calculateFinalPositions = ([maxX, maxY, robots]) =>
  R.compose(
    R.prop("finalPositions"),
    R.reduce(
      (
        { finalPositions, scentedSquares },
        [initialCoords, initialOrientation, instruction]
      ) => {
        const finalPosition = calculateFinalPosition(
          maxX,
          maxY,
          initialCoords,
          initialOrientation,
          instruction,
          scentedSquares
        );

        return {
          finalPositions: R.concat(finalPositions, [finalPosition]),
          scentedSquares: R.concat(
            scentedSquares,
            R.prop("newlyScentedSquares", finalPosition)
          )
        };
      },
      { scentedSquares: [], finalPositions: [] }
    )
  )(robots);

const splitInputStr = s =>
  R.compose(
    R.map(R.map(R.split(" "))),
    R.map(R.split("\n")),
    R.split("\n\n")
  )(s);

const parseInputStr = s => {
  const [firstRow, ...robotRows] = splitInputStr(s);
  const [[maxX, maxY], ...firstRobot] = firstRow;

  const robots = R.compose(
    R.map(robotRow => {
      const [[x, y, orientation], [instructions]] = robotRow;

      return [
        [parseInt(x), parseInt(y)],
        orientation,
        R.split("", instructions)
      ];
    }),
    R.concat([firstRobot])
  )(robotRows);

  return [parseInt(maxX), parseInt(maxY), robots];
};

const finalPositionsToStr = finalPositions =>
  R.reduce(
    (acc, { coords, orientation, lost }) => {
      const [x, y] = coords;
      const row = `${x} ${y} ${orientation}${lost ? " LOST" : ""}`;
      return acc ? `${acc}\n${row}` : row;
    },
    "",
    finalPositions
  );

const reportFinalPositions = s =>
  R.compose(finalPositionsToStr, calculateFinalPositions, parseInputStr)(s);

module.exports = {
  parseInputStr,
  calculateNewOrientation,
  calculateNewPosition,
  calculateFinalPosition,
  calculateFinalPositions,
  finalPositionsToStr,
  reportFinalPositions
};
