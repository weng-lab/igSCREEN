const svgData = (_svg): string => {
  let svg = _svg.cloneNode(true);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  let preface = '<?xml version="1.0" standalone="no"?>';
  return preface + svg.outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
};

const downloadData = (text: string, filename: string, type: string = 'text/plain') => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadSVG = (ref: React.MutableRefObject<SVGSVGElement>, filename: string) => {
  ref.current && downloadData(svgData(ref.current!), filename, 'image/svg;charset=utf-8');
}
