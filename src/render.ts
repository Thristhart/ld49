import { applyCameraTransform } from "@camera";
import { canvas } from "@canvas";
import { context } from "@context";
import { CircularBuffer } from "@util/circularBuffer";

let nextFrameRequest: number;

const prevFrameTimestamps = new CircularBuffer(200);

function getFps() {
    let totalFrameDuration = 0;
    let lastTimestamp = 0;
    for (const timestamp of prevFrameTimestamps) {
        if (lastTimestamp !== 0) {
            totalFrameDuration += timestamp - lastTimestamp;
        }
        lastTimestamp = timestamp;
    }
    const averageFrameDuration = totalFrameDuration / prevFrameTimestamps.length;

    return Math.floor(1000 / averageFrameDuration);
}

export const render = (currentTimestamp: number) => {
    prevFrameTimestamps.push(currentTimestamp);
    nextFrameRequest = requestAnimationFrame(render);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    applyCameraTransform();

    context.fillText(`fps: ${getFps()}`, 0, 0);

    context.restore();
};

if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
        cancelAnimationFrame(nextFrameRequest);
        requestAnimationFrame(newModule.render);
    });
}
