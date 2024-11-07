// vertical nice pannel
figma.showUI(__html__, {
  width: 360,
  height: 680,
  themeColors: true,
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-chart') {
    const { svg } = msg;

    try {
      // Create image from SVG
      const image = figma.createNodeFromSvg(svg);

      // Add to the page
      figma.currentPage.appendChild(image);
      figma.viewport.scrollAndZoomIntoView([image]);

      figma.notify('Chart created! 🎉');
    } catch (error) {
      console.error('Error creating chart:', error);
      figma.notify('Failed to create chart', { error: true });
    }
  }
};
