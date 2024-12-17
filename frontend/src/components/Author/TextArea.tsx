class TextArea extends HTMLTextAreaElement {
  setcontent: (v: string) => any;

  constructor() {
    super();
    this.setAttribute("id", "summernote");
    this.style.display = "none";
    this.setcontent = (v: string) => {};
  }

  set value(val: string) {
    this.setcontent(val);
  }

  set content(val: string) {
    this.innerHTML = val;
  }

  setOnChangeListener(setcontent = (v: string) => {}) {
    this.setcontent = setcontent;
  }
}

customElements.define("text-area", TextArea, { extends: "textarea" });

export default TextArea;
