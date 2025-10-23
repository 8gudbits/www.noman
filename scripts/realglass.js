// /scripts/realglass.js

// ################# //
//  Cracking effect  //
// ################# //
(function ($) {
  function drawCrackRefraction(
    canvas,
    sourceImage,
    startPoint,
    endPoint,
    pathSegment
  ) {
    var canvasContext = canvas.getContext("2d"),
      tangentX = pathSegment.tx,
      tangentY = pathSegment.ty,
      curveControlPoint = pathSegment.cpt,
      noiseScale = 3,
      textureDisplacement = 6,
      boundingBoxX = pathSegment.bbx1,
      boundingBoxY = pathSegment.bby1,
      boundingBoxWidth = pathSegment.bbwidth + noiseScale * 2,
      boundingBoxHeight = pathSegment.bbheight + noiseScale * 2;

    if (80 === 0) return;

    canvasContext.globalAlpha = 80 || 1;
    canvasContext.save();

    canvasContext.beginPath();
    canvasContext.moveTo(
      startPoint.x + noiseScale * tangentX,
      startPoint.y + noiseScale * tangentY
    );
    canvasContext.quadraticCurveTo(
      curveControlPoint.x,
      curveControlPoint.y,
      endPoint.x + noiseScale * tangentX,
      endPoint.y + noiseScale * tangentY
    );
    canvasContext.lineTo(
      endPoint.x - noiseScale * tangentX,
      endPoint.y - noiseScale * tangentY
    );
    canvasContext.quadraticCurveTo(
      curveControlPoint.x,
      curveControlPoint.y,
      startPoint.x - noiseScale * tangentX,
      startPoint.y - noiseScale * tangentY
    );
    canvasContext.closePath();
    canvasContext.clip();

    try {
      if (boundingBoxX + textureDisplacement * tangentX < 0)
        boundingBoxX = -textureDisplacement * tangentX;
      if (boundingBoxY + textureDisplacement * tangentY < 0)
        boundingBoxY = -textureDisplacement * tangentY;
      if (
        boundingBoxWidth + boundingBoxX + textureDisplacement * tangentX >
        canvasContext.canvas.width
      )
        boundingBoxWidth =
          canvasContext.canvas.width -
          boundingBoxX +
          textureDisplacement * tangentX;
      if (
        boundingBoxHeight + boundingBoxY + textureDisplacement * tangentY >
        canvasContext.canvas.height
      )
        boundingBoxHeight =
          canvasContext.canvas.height -
          boundingBoxY +
          textureDisplacement * tangentY;

      canvasContext.drawImage(
        sourceImage,
        boundingBoxX + textureDisplacement * tangentX,
        boundingBoxY + textureDisplacement * tangentY,
        boundingBoxWidth,
        boundingBoxHeight,
        boundingBoxX,
        boundingBoxY,
        boundingBoxWidth,
        boundingBoxHeight
      );
    } catch (e) {}

    canvasContext.restore();
  }

  function drawCrackReflection(
    canvas,
    sourceImage,
    startPoint,
    endPoint,
    pathSegment
  ) {
    var canvasContext = canvas.getContext("2d"),
      tangentX = pathSegment.tx,
      tangentY = pathSegment.ty,
      curveControlPoint = pathSegment.cpt,
      detailDistance = pathSegment.dl / 3,
      gradient,
      colorGenerator = {
        alpha: function (a) {
          return {
            toRgbaString: function () {
              return `rgba(255,255,255,${a})`;
            },
          };
        },
      };

    if (0.3 === 0) return;
    canvasContext.globalAlpha = 0.3 || 1;

    try {
      gradient = canvasContext.createLinearGradient(
        startPoint.x + detailDistance * tangentX,
        startPoint.y + detailDistance * tangentY,
        startPoint.x - detailDistance * tangentX,
        startPoint.y - detailDistance * tangentY
      );
    } catch (e) {}

    gradient.addColorStop(0, colorGenerator.alpha(0).toRgbaString());
    gradient.addColorStop(0.5, colorGenerator.alpha(0.5).toRgbaString());
    gradient.addColorStop(1, colorGenerator.alpha(0).toRgbaString());
    canvasContext.fillStyle = gradient;

    canvasContext.beginPath();
    canvasContext.moveTo(
      startPoint.x + detailDistance * tangentX,
      startPoint.y + detailDistance * tangentY
    );
    canvasContext.lineTo(
      endPoint.x + detailDistance * tangentX,
      endPoint.y + detailDistance * tangentY
    );
    canvasContext.lineTo(
      endPoint.x - detailDistance * tangentX,
      endPoint.y - detailDistance * tangentY
    );
    canvasContext.lineTo(
      startPoint.x - detailDistance * tangentX,
      startPoint.y - detailDistance * tangentY
    );
    canvasContext.closePath();
    canvasContext.fill();
  }

  function drawCrackFractures(
    canvas,
    sourceImage,
    startPoint,
    endPoint,
    pathSegment
  ) {
    var canvasContext = canvas.getContext("2d"),
      tangentX = pathSegment.tx,
      tangentY = pathSegment.ty,
      slopeX = pathSegment.sx,
      slopeY = pathSegment.sy,
      fractureSize = 20,
      pathLength = pathSegment.dl,
      midPoint = pathLength / 2,
      midPointPercentage = pathSegment.mpp,
      curveMagnitude = pathSegment.cma,
      firstSegmentLength = pathSegment.mpl1,
      secondSegmentLength = pathSegment.mpl2,
      segmentIndex,
      position,
      curveOffset,
      fractureWidth,
      fractureHeight1,
      fractureHeight2,
      rotation,
      colorGenerator = {
        alpha: function (a) {
          return {
            toRgbaString: function () {
              return `rgba(255,255,255,${a})`;
            },
          };
        },
      };

    if (0.4 === 0) return;
    canvasContext.globalAlpha = 0.4 || 1;
    canvasContext.lineWidth = 1;

    for (segmentIndex = 0; segmentIndex < pathLength; segmentIndex++) {
      if (segmentIndex < midPointPercentage * pathLength)
        curveOffset =
          curveMagnitude *
          (1 -
            Math.pow(
              (firstSegmentLength - segmentIndex) / firstSegmentLength,
              2
            ));
      else
        curveOffset =
          curveMagnitude *
          (1 -
            Math.pow(
              (secondSegmentLength - (pathLength - segmentIndex)) /
                secondSegmentLength,
              2
            ));

      curveOffset /= 2;
      position = Math.pow(
        (segmentIndex > midPoint ? pathLength - segmentIndex : segmentIndex) /
          midPoint,
        2
      );

      fractureWidth = Math.random() * 1 + 1;
      fractureHeight1 =
        fractureSize - Math.random() * position * fractureSize + 1;
      fractureHeight2 =
        fractureSize - Math.random() * position * fractureSize + 1;
      rotation = Math.random() * 14 - 7;

      if (Math.random() > position - fractureSize / midPoint) {
        canvasContext.fillStyle = colorGenerator
          .alpha(Math.round(Math.random() * 8 + 4) / 12)
          .toRgbaString();
        canvasContext.beginPath();
        canvasContext.moveTo(
          startPoint.x + segmentIndex * slopeX + curveOffset * tangentX,
          startPoint.y + segmentIndex * slopeY + curveOffset * tangentY
        );
        canvasContext.lineTo(
          startPoint.x +
            (rotation + segmentIndex + fractureWidth / 2) * slopeX +
            fractureHeight1 * tangentX +
            curveOffset * tangentX,
          startPoint.y +
            (-rotation + segmentIndex + fractureWidth / 2) * slopeY +
            fractureHeight1 * tangentY +
            curveOffset * tangentY
        );
        canvasContext.lineTo(
          startPoint.x +
            (segmentIndex + fractureWidth) * slopeX +
            curveOffset * tangentX,
          startPoint.y +
            (segmentIndex + fractureWidth) * slopeY +
            curveOffset * tangentY
        );
        canvasContext.lineTo(
          startPoint.x +
            (-rotation + segmentIndex + fractureWidth / 2) * slopeX -
            fractureHeight2 * tangentX +
            curveOffset * tangentX,
          startPoint.y +
            (rotation + segmentIndex + fractureWidth / 2) * slopeY -
            fractureHeight2 * tangentY +
            curveOffset * tangentY
        );
        canvasContext.closePath();
        canvasContext.fill();
      }
      segmentIndex += midPoint * (position / 2 + 0.5);
    }
  }

  function drawCrackMainLine(
    canvas,
    sourceImage,
    startPoint,
    endPoint,
    pathSegment
  ) {
    var canvasContext = canvas.getContext("2d"),
      tangentX = pathSegment.tx,
      tangentY = pathSegment.ty,
      curveControlPoint = pathSegment.cpt,
      noiseScale = 0.03,
      strokeThickness = 0.14,
      highlightLength = 0.2,
      textureOffset = Math.random() * (noiseScale * 2) - (noiseScale * 2) / 2,
      colorGenerator = {
        lightness: function (l) {
          return this;
        },
        alpha: function (a) {
          return {
            toRgbaString: function () {
              return `rgba(255,255,255,${a})`;
            },
          };
        },
      },
      noiseIntensity = 0.5;

    if (65 === 0) return;
    canvasContext.globalAlpha = 65 || 1;
    canvasContext.lineWidth = 1;

    while (strokeThickness > 0) {
      canvasContext.strokeStyle = colorGenerator
        .alpha(Math.round(Math.random() * 8 + 4) / 12)
        .toRgbaString();
      canvasContext.beginPath();
      canvasContext.moveTo(
        startPoint.x + (strokeThickness + textureOffset) * tangentX,
        startPoint.y + (strokeThickness - textureOffset) * tangentY
      );
      canvasContext.quadraticCurveTo(
        curveControlPoint.x,
        curveControlPoint.y,
        endPoint.x + (strokeThickness - textureOffset) * tangentX,
        endPoint.y + (strokeThickness + textureOffset) * tangentY
      );
      canvasContext.stroke();
      strokeThickness--;
    }
  }

  function drawCrackNoise(
    canvas,
    sourceImage,
    startPoint,
    endPoint,
    pathSegment
  ) {
    var canvasContext = canvas.getContext("2d"),
      tangentX = pathSegment.tx,
      tangentY = pathSegment.ty,
      slopeX = pathSegment.sx,
      slopeY = pathSegment.sy,
      noiseFrequency = 0.4,
      pathLength = pathSegment.dl,
      midPoint = pathLength / 2,
      midPointPercentage = pathSegment.mpp,
      curveMagnitude = pathSegment.cma,
      firstSegmentLength = pathSegment.mpl1,
      secondSegmentLength = pathSegment.mpl2,
      detailDistance = pathLength / 3,
      stepSize = Math.ceil(
        detailDistance * (1 - (noiseFrequency + 0.5) / 1.5) + 1
      ),
      curveOffset,
      tangentOffset,
      segmentIndex,
      position,
      count,
      mirror,
      colorGenerator = {
        alpha: function (a) {
          return {
            toRgbaString: function () {
              return `rgba(255,255,255,${a})`;
            },
          };
        },
      };

    if (1 === 0) return;
    canvasContext.globalAlpha = 1 || 1;
    canvasContext.lineWidth = 1;

    for (segmentIndex = 0; segmentIndex < pathLength; segmentIndex++) {
      if (segmentIndex < midPointPercentage * pathLength)
        curveOffset =
          curveMagnitude *
          (1 -
            Math.pow(
              (firstSegmentLength - segmentIndex) / firstSegmentLength,
              2
            ));
      else
        curveOffset =
          curveMagnitude *
          (1 -
            Math.pow(
              (secondSegmentLength - (pathLength - segmentIndex)) /
                secondSegmentLength,
              2
            ));

      curveOffset /= 2;

      for (
        tangentOffset = -detailDistance;
        tangentOffset < detailDistance;
        tangentOffset++
      ) {
        if (Math.random() > Math.abs(tangentOffset) / detailDistance) {
          count = Math.floor(Math.random() * 3 + 0.5);
          mirror = Math.random() * 1.4 - 0.7;

          while (count >= 0) {
            canvasContext.strokeStyle = colorGenerator
              .alpha(Math.round(Math.random() * 10 + 2) / 30)
              .toRgbaString();
            position = Math.floor(Math.random() * 4 + 0.5);
            canvasContext.beginPath();
            canvasContext.moveTo(
              startPoint.x +
                (segmentIndex - position) * slopeX +
                (mirror + tangentOffset) * tangentX +
                curveOffset * tangentX,
              startPoint.y +
                (segmentIndex - position) * slopeY +
                (-mirror + tangentOffset) * tangentY +
                curveOffset * tangentY
            );
            canvasContext.lineTo(
              startPoint.x +
                (segmentIndex + position) * slopeX +
                (-mirror + tangentOffset) * tangentX +
                curveOffset * tangentX,
              startPoint.y +
                (segmentIndex + position) * slopeY +
                (mirror + tangentOffset) * tangentY +
                curveOffset * tangentY
            );
            canvasContext.stroke();
            count--;
            position++;
          }
        }
        tangentOffset += Math.random() * stepSize * 2;
      }
      segmentIndex += Math.random() * stepSize * 4;
    }
  }

  function renderAllCrackEffects($canvasElements, crackSegments) {
    var i,
      pathSegment,
      len = crackSegments.length;
    var placeholderImage = new Image();

    for (i = 0; i < len; i++) {
      pathSegment = crackSegments[i];
      drawCrackRefraction(
        $canvasElements[0],
        placeholderImage,
        pathSegment.p1,
        pathSegment.p2,
        pathSegment.desc
      );
      drawCrackReflection(
        $canvasElements[1],
        placeholderImage,
        pathSegment.p1,
        pathSegment.p2,
        pathSegment.desc
      );
      drawCrackFractures(
        $canvasElements[2],
        placeholderImage,
        pathSegment.p1,
        pathSegment.p2,
        pathSegment.desc
      );
      drawCrackMainLine(
        $canvasElements[3],
        placeholderImage,
        pathSegment.p1,
        pathSegment.p2,
        pathSegment.desc
      );
      drawCrackNoise(
        $canvasElements[4],
        placeholderImage,
        pathSegment.p1,
        pathSegment.p2,
        pathSegment.desc
      );
    }
  }

  var DEGREE_TO_RADIAN = Math.PI / 180;

  function calculateCirclePoint(center, radius, angle) {
    return {
      x:
        center.x +
        radius * Math.cos(angle * DEGREE_TO_RADIAN) -
        radius * Math.sin(angle * DEGREE_TO_RADIAN),
      y:
        center.y +
        radius * Math.sin(angle * DEGREE_TO_RADIAN) +
        radius * Math.cos(angle * DEGREE_TO_RADIAN),
    };
  }

  function calculateLinePathData(firstPoint, secondPoint, curveIntensity) {
    var data = {},
      curveIntensity = 3.5 * curveIntensity;
    data.dx = secondPoint.x - firstPoint.x;
    data.dy = secondPoint.y - firstPoint.y;
    data.dl = Math.sqrt(data.dx * data.dx + data.dy * data.dy);
    data.sx = data.dx / data.dl;
    data.sy = data.dy / data.dl;
    data.tx = data.dy / data.dl;
    data.ty = -data.dx / data.dl;
    data.mpp = Math.random() * 0.5 + 0.3;
    data.mpl1 = data.dl * data.mpp;
    data.mpl2 = data.dl - data.mpl1;
    var logLength = Math.log(data.dl * Math.E);
    data.cma =
      Math.random() * logLength * curveIntensity -
      (logLength * curveIntensity) / 2;
    data.cpt = {
      x: firstPoint.x + data.sx * data.mpl1 + data.tx * data.cma,
      y: firstPoint.y + data.sy * data.mpl1 + data.ty * data.cma,
    };
    data.bbx1 = Math.min(firstPoint.x, secondPoint.x, data.cpt.x);
    data.bby1 = Math.min(firstPoint.y, secondPoint.y, data.cpt.y);
    data.bbx2 = Math.max(firstPoint.x, secondPoint.x, data.cpt.x);
    data.bby2 = Math.max(firstPoint.y, secondPoint.y, data.cpt.y);
    data.bbwidth = data.bbx2 - data.bbx1;
    data.bbheight = data.bby2 - data.bby1;
    return data;
  }

  function generateCrackPathSegments(crackConfig) {
    var imageMinX = 0,
      imageMinY = 0,
      imageWidth = crackConfig.width,
      imageHeight = crackConfig.height,
      crackLayers = [[]],
      crackLines = [],
      currentLayer = 1,
      maxLayer = 0,
      radius = 15,
      center = crackConfig.center,
      firstPoint,
      secondPoint,
      angle,
      segmentCount,
      currentAngle;

    segmentCount = 20;
    angle = 360 / (segmentCount + 1);

    while (crackLayers[0].length < segmentCount) {
      currentAngle = angle * crackLayers[0].length + 10;
      secondPoint = calculateCirclePoint(center, 5, currentAngle);
      crackLayers[0].push({ angle: currentAngle, point: secondPoint });
    }

    while (radius < 300) {
      crackLayers[currentLayer] = [];
      for (currentAngle = 0; currentAngle < segmentCount; currentAngle++) {
        firstPoint = crackLayers[currentLayer - 1][currentAngle];
        crackLayers[currentLayer][currentAngle] = null;

        if (firstPoint) {
          if (
            firstPoint.point.x > imageMinX &&
            firstPoint.point.x < imageWidth &&
            firstPoint.point.y > imageMinY &&
            firstPoint.point.y < imageHeight
          ) {
            angle =
              firstPoint.angle +
              (Math.random() * 7) / segmentCount -
              7 / 2 / segmentCount;
            if (angle > 350) angle = 350;
            firstPoint = firstPoint.point;
            secondPoint = calculateCirclePoint(
              center,
              radius +
                (Math.random() * radius) / currentLayer -
                radius / (currentLayer * 2),
              angle
            );
            crackLayers[currentLayer][currentAngle] = {
              angle: angle,
              point: { x: secondPoint.x, y: secondPoint.y },
            };
          } else if (maxLayer == 0) {
            maxLayer = currentLayer;
          }
        }
      }
      currentLayer++;
      radius *= Math.random() * 1.3 + (1.3 - 50 / 100);
    }

    if (maxLayer == 0) maxLayer = currentLayer;
    var layerIndex = 1,
      segmentIndex = 0;

    for (; layerIndex < currentLayer; layerIndex++) {
      for (segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
        firstPoint = crackLayers[layerIndex - 1][segmentIndex];
        secondPoint = crackLayers[layerIndex][segmentIndex];

        if (firstPoint && secondPoint) {
          crackLines.push({
            p1: { x: firstPoint.point.x, y: firstPoint.point.y },
            p2: { x: secondPoint.point.x, y: secondPoint.point.y },
            desc: calculateLinePathData(
              firstPoint.point,
              secondPoint.point,
              21 / 100
            ),
            level: layerIndex,
          });

          if (Math.random() < 60 / 100) {
            firstPoint =
              crackLayers[layerIndex][(segmentIndex + 1) % segmentCount];
            if (firstPoint) {
              crackLines.push({
                p1: { x: secondPoint.point.x, y: secondPoint.point.y },
                p2: { x: firstPoint.point.x, y: firstPoint.point.y },
                desc: calculateLinePathData(
                  secondPoint.point,
                  firstPoint.point,
                  21 / 100
                ),
                level: layerIndex,
              });
            }
          }

          if (layerIndex < currentLayer - 1 && Math.random() < 30 / 100) {
            firstPoint =
              crackLayers[layerIndex + 1][(segmentIndex + 1) % segmentCount];
            if (firstPoint) {
              crackLines.push({
                p1: { x: secondPoint.point.x, y: secondPoint.point.y },
                p2: { x: firstPoint.point.x, y: firstPoint.point.y },
                desc: calculateLinePathData(
                  secondPoint.point,
                  firstPoint.point,
                  21 / 100
                ),
                level: layerIndex,
              });
            }
          }
        }
      }
    }
    return crackLines;
  }

  function clearAllCanvases($canvas) {
    $canvas.each(function () {
      var canvasContext = this.getContext("2d");
      canvasContext.clearRect(
        0,
        0,
        canvasContext.canvas.width,
        canvasContext.canvas.height
      );
    });
  }

  // Crack effect manager for glass panels
  class GlassCrackManager {
    constructor(panel) {
      this.panel = panel;
      this.interactionCount = 0;
      this.crackCount = 0; // Track actual number of cracks generated
      this.maxCracks = 6; // Maximum number of cracks allowed
      this.canvases = [];
      this.crackOriginPoint = null;
      this.crackChance = 0; // Start with 0% chance of cracking
      this.initializeCrackSystem();
    }

    initializeCrackSystem() {
      this.setupCrackCanvases();
      this.panel.style.position = "relative";
      this.panel.addEventListener("click", (e) => this.processPanelClick(e));
    }

    setupCrackCanvases() {
      const canvasContainer = document.createElement("div");
      canvasContainer.className = "crack-container";

      for (let i = 0; i < 6; i++) {
        const canvas = document.createElement("canvas");
        canvas.className = "crack-canvas";
        if (i === 5) canvas.style.display = "none"; // debug canvas
        this.canvases.push(canvas);
        canvasContainer.appendChild(canvas);
      }

      this.panel.appendChild(canvasContainer);
      this.resizeCrackCanvases();
      window.addEventListener("resize", () => this.resizeCrackCanvases());
    }

    resizeCrackCanvases() {
      const panelBounds = this.panel.getBoundingClientRect();
      this.canvases.forEach((canvas) => {
        canvas.width = panelBounds.width;
        canvas.height = panelBounds.height;
      });
    }

    processPanelClick(e) {
      // Check if we've reached the maximum number of cracks
      if (this.crackCount >= this.maxCracks) {
        return; // Stop processing clicks if max cracks reached
      }

      const panelBounds = this.panel.getBoundingClientRect();
      this.crackOriginPoint = {
        x: e.clientX - panelBounds.left,
        y: e.clientY - panelBounds.top,
      };

      this.interactionCount++;

      // PROBABILITY-BASED CRACKING SYSTEM:
      // Click 1: 0% chance (no crack)
      // Click 2: 50% chance
      // Click 3: 60% chance (50% + 10%)
      // Click 4: 70% chance
      // Click 5: 80% chance
      // Click 6: 90% chance
      // Click 7+: 100% chance

      if (this.interactionCount === 1) {
        return; // First click: 0% chance, do nothing
      }

      // Calculate probability based on click count
      if (this.interactionCount === 2) {
        this.crackChance = 0.5;
      } else if (this.interactionCount > 2 && this.interactionCount <= 6) {
        this.crackChance = 0.5 + (this.interactionCount - 2) * 0.1; // +10% each click
      } else if (this.interactionCount > 6) {
        this.crackChance = 1.0; // 100% chance after 6 clicks
      }

      const randomProbability = Math.random();
      const shouldGenerateCrack = randomProbability <= this.crackChance;

      if (shouldGenerateCrack) {
        this.crackCount++; // Increment crack count
        this.generateCrackEffect();

        // Check if we've reached the maximum cracks
        if (this.crackCount >= this.maxCracks) {
          this.disableCracking(); // Disable further cracking
        }
      }
    }

    generateCrackEffect() {
      const crackConfig = {
        height: this.panel.clientHeight,
        width: this.panel.clientWidth,
        center: this.crackOriginPoint,
        debug: false,
      };

      const crackSegments = generateCrackPathSegments(crackConfig);
      renderAllCrackEffects(this.canvases, crackSegments);
    }

    disableCracking() {
      // Remove the click event listener to prevent further cracks
      this.panel.removeEventListener("click", this.processPanelClick);
    }
  }

  // Initialize on all glass panels
  function initializeAllGlassCracks() {
    const glassPanelElements = document.querySelectorAll(".glass-panel");
    glassPanelElements.forEach((panel) => {
      new GlassCrackManager(panel);
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAllGlassCracks);
  } else {
    initializeAllGlassCracks();
  }
})(window.jQuery || { fn: {} });

