export const downloadImage = (imageData: string, index: number) => {
  const link = document.createElement('a');
  link.href = `data:image/png;base64,${imageData}`;
  link.download = `extracted_image_${index + 1}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
