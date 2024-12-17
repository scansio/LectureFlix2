import Reblend from "reblendjs";

function Wrapper({ children, className, style = null }: any) {
  return (
    <div class={`${className ?? ""} wrapper`} style={style}>
      <section class="block col-12 block-desktop col-12-desktop">
        {children}
      </section>
    </div>
  );
}

export default Wrapper;
