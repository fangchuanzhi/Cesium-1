$(function () {
  $(".camera-tutor a").click(function () {

    layer.alert('使用“W A S D” 来控制相机方向 , “Q E”控制高度', {
      icon: 3
    }); //这时如果你也还想执行yes回调，可以放在第三个参数中。
    canvas.setAttribute("tabindex", "0"); // needed to put focus on the canvas
    canvas.onclick = function () {
      canvas.focus();
    };
    var ellipsoid = scene.globe.ellipsoid;

    function setScreenSpaceCameraController() {
      scene.screenSpaceCameraController.enableRotate = !scene
        .screenSpaceCameraController.enableRotate;
      scene.screenSpaceCameraController.enableTranslate = !scene
        .screenSpaceCameraController.enableTranslate;
      scene.screenSpaceCameraController.enableZoom = !scene
        .screenSpaceCameraController.enableZoom;
      scene.screenSpaceCameraController.enableTilt = !scene
        .screenSpaceCameraController.enableTilt;
      scene.screenSpaceCameraController.enableLook = !scene
        .screenSpaceCameraController.enableLook;
    }
    setScreenSpaceCameraController();
    var startMousePosition;
    var mousePosition;

    var flags = {
      looking: false,
      moveForward: false,
      moveBackward: false,
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false,
    };

    function getFlagForKeyCode(keyCode) {
      switch (keyCode) {
        case "W".charCodeAt(0):
          return "moveForward";
        case "S".charCodeAt(0):
          return "moveBackward";
        case "Q".charCodeAt(0):
          return "moveUp";
        case "E".charCodeAt(0):
          return "moveDown";
        case "D".charCodeAt(0):
          return "moveRight";
        case "A".charCodeAt(0):
          return "moveLeft";
        default:
          return undefined;
      }
    }
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    // 鼠标操控视角
    handler.setInputAction(function (movement) {
      flags.looking = true;
      mousePosition = startMousePosition = Cesium.Cartesian3.clone(
        movement.position
      );
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(function (movement) {
      mousePosition = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function () {
      flags.looking = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    //设定 监听事件
    document.addEventListener("keydown", addKeyListener);

    function addKeyListener(e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined") {
        flags[flagName] = true;
      }
    }

    document.addEventListener("keyup", addKeyListener2);

    function addKeyListener2(e) {
      var flagName = getFlagForKeyCode(e.keyCode);
      if (typeof flagName !== "undefined") {
        flags[flagName] = false;
      }
    }
    viewer.clock.onTick.addEventListener(function (clock) {
      var camera = viewer.camera;

      if (flags.looking) {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        // Coordinate (0.0, 0.0) will be where the mouse was clicked.
        var x = (mousePosition.x - startMousePosition.x) / width;
        var y = -(mousePosition.y - startMousePosition.y) / height;

        var lookFactor = 0.05;
        camera.lookRight(x * lookFactor);
        camera.lookUp(y * lookFactor);
      }

      // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
      var cameraHeight = ellipsoid.cartesianToCartographic(camera.position)
        .height;
      var moveRate = cameraHeight / 100.0;

      if (flags.moveForward) {
        camera.moveForward(moveRate);
      }
      if (flags.moveBackward) {
        camera.moveBackward(moveRate);
      }
      if (flags.moveUp) {
        camera.moveUp(moveRate);
      }
      if (flags.moveDown) {
        camera.moveDown(moveRate);
      }
      if (flags.moveLeft) {
        camera.moveLeft(moveRate);
      }
      if (flags.moveRight) {
        camera.moveRight(moveRate);
      }
    });
    handler.setInputAction(function () {
      layer.msg('已结束键盘模式！', {
        time: 1000,
      });
      handler.destroy();
      console.log("camera handler");
      if (handler.isDestroyed()) {
        console.log(handler.isDestroyed(), "handler has destroy");
      } else {
        console.log(handler.isDestroyed(), "handler has no destroy");
      }
      setScreenSpaceCameraController();
      document.removeEventListener("keydown", addKeyListener);
      console.log("removeEventListener");
      document.removeEventListener("keyup", addKeyListener2);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  });
});