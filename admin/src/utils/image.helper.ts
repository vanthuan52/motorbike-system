export const imageHelper = {
  onPreviewImage: async (file: any) => {
    let src = file.url || file.thumbUrl;
    if (!src && file.originFileObj) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    // To see image on a new browser tab
    const image = new Image();
    image.src = src;
    const w = window.open("");
    w?.document.write(image.outerHTML);
  },
  getBase64: (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    }),
};
