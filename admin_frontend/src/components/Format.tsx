import Reblend, { useEffect, useState } from "reblendjs";
import Highlight from "react-highlight";

function Format({
  language,
  code,
  colored = false,
}: {
  language: string;
  code: string;
  colored?: boolean;
}) {
  const [formattedCode, setFormattedCode] = useState<string | null>(null);

  useEffect(() => {
    let formatted = "";
    try {
      //@ts-ignore
      formatted = prettier.format(code, {
        parser: language,
        //@ts-ignore
        plugins: prettierPlugins,
      });
    } catch (error) {
    } finally {
      setFormattedCode(formatted || code);
    }
  }, [code, language]);

  return colored ? (
    <pre>
      {formattedCode ? (
        <Highlight className={language}>{formattedCode}</Highlight>
      ) : null}
    </pre>
  ) : (
    <pre>{formattedCode}</pre>
  );
}

export default Format;
