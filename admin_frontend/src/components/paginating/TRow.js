/* eslint-disable require-jsdoc */
import Reblend from "reblendjs";

function TRow(
  {
    ref,
    result,
    resultIndex,
    style,
    className,
    options,
    numbered = true,
    fieldKeys,
    fields,
    computeValue,
    ...props
  }
) {
  return (
    <tr
      {...props}
      style={style?.trStyle}
      className={`${className?.trClass || ""}`}
      {...options}
      onClick={options?.onClick && ((e) => options?.onClick(e, result))}
      ref={ref}
    >
      {numbered ? (
        <td
          style={style?.tdStyle || {}}
          className={`${className?.tdClass || ""}`}
        >
          {resultIndex + 1}
        </td>
      ) : null}
      {fieldKeys?.map((field) => (
        // Cell
        <td
          key={field}
          style={style?.tdStyle}
          className={`${className?.tdClass || ""} ${!fields[field]?.virtual ? "overflow-mw200" : ""}`}
        >
          {computeValue(result[field], field, resultIndex)}
        </td>
      ))}
    </tr>
  );
}

export default TRow;
