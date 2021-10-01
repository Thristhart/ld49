import { canvas } from "@canvas";
import { context } from "@context";

export interface Camera {
    x: number;
    y: number;
    xScale: number;
    yScale: number;
}

export const camera: Camera = {
    x: 0,
    y: 0,
    xScale: 1,
    yScale: 1,
};

export const setCameraScale = (scale: number) => {
    camera.xScale = camera.yScale = scale;
};

export const applyCameraTransform = () => {
    context.translate(canvas.width / 2 - camera.x * camera.xScale, canvas.height / 2 - camera.y * camera.yScale);

    context.scale(camera.xScale, camera.yScale);
};

export const zoomToFitWidth = (targetWidth: number) => {
    setCameraScale(canvas.width / targetWidth);
};

zoomToFitWidth(200);
