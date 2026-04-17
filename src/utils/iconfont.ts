let linkhref = new URL(`../assets/iconfont/iconfont.css`, import.meta.url).href;
let regexp = /(\w+\-)+(\w+\::)+\w+/g;

export let iconList: string[] = [];

export const getIcons = (url: string = linkhref): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "text";
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        iconList = (xhr.responseText.match(regexp) || []).map(item => item.replaceAll("::before", ""));
        resolve(iconList);
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        reject("error");
      }
    };
    xhr.send();
  });
};
