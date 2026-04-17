export default () => {
  const styledom = document.createElement("style");
  styledom.innerHTML = `
  .zyf-dt-error-toast {
    background:rgb(254,240.3,240.3);
    border-radius:4px;
    border:1px solid rgb(253,225.6,225.6);
    padding:11px 15px;
    display:flex;
    justify-content:center;
    align-items:center;
    position:fixed;
    top:0%;
    left:50%;
    transform:translateX(-50%);
    cursor:pointer;
    z-index: 99999;
    transition: top .5s;
    color: #f56c6c;
  }
  .error-icon {
    display: block;width: 14px;height: 14px;border-radius: 50%;background: #f56c6c;position: relative;
  }
  .error-icon:before {
    content:"";width:2px;height:8px;background:#fff;border-radius:2px;position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;transform:rotate(-45deg);
  }
  .error-icon:after {
    content:"";width:2px;height:8px;background:#fff;border-radius:2px;position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;transform:rotate(45deg);
  }`;
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(styledom);
};
