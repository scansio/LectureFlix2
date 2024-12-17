import Reblend, { useContext } from "reblendjs";
import { modelsContext } from "../context";
import Model from "./Model";

function ModelContainer() {
  const [models] = useContext(modelsContext);

  return (
    <div style="height: auto; border: none; margin: 0px; padding: 0px;">
      {Array.from(models).map(([key, model]) => (
        <Model model={{ model, tag: key }} />
      ))}
    </div>
  );
}

export default ModelContainer;
