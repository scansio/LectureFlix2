import Reblend from 'reblendjs';

function Parameter({ required, type, deprecated, paramIn, name, setter }: any) {
  return (
    <tr data-param-name={name} data-param-in="path">
      <td class="col parameters-col_name">
        <div class="parameter__name required">
          rideId {required ? <span style="color: red;">&nbsp;*</span> : null}
        </div>
        <div class="parameter__type">{type}</div>
        <div class="parameter__deprecated">{deprecated}</div>
        <div class="parameter__in">({paramIn})</div>
      </td>
      <td class="col parameters-col_description">
        <input
          onChange={setter}
          type="text"
          class=""
          title=""
          placeholder={name}
          value=""
        />
      </td>
    </tr>
  );
}

export default Parameter;
