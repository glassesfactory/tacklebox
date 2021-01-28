export const createLog = (container: Element, text:string, elName: string = 'li') => {
  const el = document.createElement(elName);
  el.className = "log";
  el.textContent = text;
  container.appendChild(el);
}
