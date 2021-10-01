const canvasOnDocument = document.querySelector("canvas");
if (!canvasOnDocument) {
    throw new Error("missing canvas somehow");
}
export const canvas = canvasOnDocument!;
